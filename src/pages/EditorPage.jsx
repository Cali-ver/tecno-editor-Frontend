import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fabric } from 'fabric';
import useEditorStore from '../store/useEditorStore';
import { designAPI } from '../api/client';
import { 
  ChevronLeft, Undo, Redo, Share, Download, Play, 
  Grid, Type, UploadCloud, Image as ImageIcon, Crown,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  FlipHorizontal, FlipVertical, ChevronDown, 
  Lock, Link2, Smartphone, MoreHorizontal, Calendar, Folder,
  Check, X, Image
} from 'lucide-react';
import jsPDF from 'jspdf';

import ElementsPanel from '../components/editor/ElementsPanel';
import TextPanel from '../components/editor/TextPanel';
import UploadPanel from '../components/editor/UploadPanel';
import CopyLinkButton from '../components/editor/CopyLinkButton';
import SendToPhoneModal from '../components/SendToPhoneModal';

const PhotosPanel = () => <div className="p-4 text-gray-500">Photos Panel coming soon...</div>;
const BrandPanel = () => <div className="p-4 text-gray-500">Brand Panel coming soon...</div>;

const EditorPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const canvasRef = useRef(null);

  const { 
    fabricCanvas, setFabricCanvas, 
    activePanel, setActivePanel,
    selectedObject, setSelectedObject,
    isSaved, markSaved,
    designId, designTitle, accessLevel, ownerEmail, isPublic, setDesign,
    saveSnapshot, undo, redo, zoom, setZoom
  } = useEditorStore();

  const { user } = useAuth();
  const isReadOnly = designId && accessLevel === 'PUBLIC_VIEW' && user?.email !== ownerEmail;
  const isOwner = !designId || user?.email === ownerEmail;

  const [forceRender, setForceRender] = useState(false);
  const [rightTab, setRightTab] = useState('design');

  // 1. Initialize Canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 1080,
      height: 720,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true
    });

    setFabricCanvas(canvas);

    const updateSelection = (e) => {
      setSelectedObject(e.selected ? e.selected[0] : null);
      setForceRender(prev => !prev);
    };

    canvas.on('object:modified', () => {
      saveSnapshot();
      setForceRender(prev => !prev);
    });
    canvas.on('selection:created', updateSelection);
    canvas.on('selection:updated', updateSelection);
    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
      setForceRender(prev => !prev);
    });
    canvas.on('mouse:wheel', (opt) => {
      // Optional: zoom on wheel
      // var delta = opt.e.deltaY;
      // let newZoom = canvas.getZoom() * (0.999 ** delta);
      // setZoom(newZoom);
      // opt.e.preventDefault();
      // opt.e.stopPropagation();
    });

    return () => {
      canvas.dispose();
      setFabricCanvas(null);
    };
  }, [setFabricCanvas, setSelectedObject, saveSnapshot]);

  // 2. Load Design
  useEffect(() => {
    const id = searchParams.get('id');
    if (id && fabricCanvas) {
      designAPI.getById(id).then(res => {
        setDesign(res.data.id, res.data.title, res.data.accessLevel, res.data.ownerEmail, res.data.isPublic);
        if (res.data.jsonData) {
          try {
            const parsed = JSON.parse(res.data.jsonData);
            fabricCanvas.loadFromJSON(parsed, () => {
              fabricCanvas.renderAll();
              saveSnapshot();
              markSaved();
            });
          } catch (e) {
            console.error("Failed to parse canvas JSON", e);
          }
        }
      }).catch(err => console.error("Failed to load design", err));
    }
  }, [searchParams, fabricCanvas, setDesign, saveSnapshot, markSaved]);

  // 3. Auto-save
  useEffect(() => {
    const interval = setInterval(() => {
      const state = useEditorStore.getState();
      if (!state.isSaved && state.designId && state.fabricCanvas && !isReadOnly) {
        const thumbnailData = state.fabricCanvas.toDataURL({
          format: 'png',
          quality: 0.2,
          multiplier: 0.5 // Keep memory low
        });

        designAPI.update(state.designId, { 
          title: state.designTitle,
          jsonData: JSON.stringify(state.fabricCanvas.toJSON()),
          thumbnail: thumbnailData
        }).then(() => {
          state.markSaved();
        }).catch(err => console.error("Autosave failed", err));
      }
    }, 30000); // 30 seconds
 
    return () => clearInterval(interval);
  }, []);
 
  // 4. Handle Read-Only Mode
  useEffect(() => {
    if (!fabricCanvas) return;
    
    if (isReadOnly) {
      fabricCanvas.selection = false;
      fabricCanvas.hoverCursor = 'default';
      fabricCanvas.getObjects().forEach(obj => {
        obj.selectable = false;
        obj.evented = false;
      });
      fabricCanvas.discardActiveObject();
    } else {
      fabricCanvas.selection = true;
      fabricCanvas.hoverCursor = 'move';
      fabricCanvas.getObjects().forEach(obj => {
        obj.selectable = true;
        obj.evented = true;
      });
    }
    fabricCanvas.renderAll();
  }, [isReadOnly, fabricCanvas]);

  const handleBackToDashboard = () => {
    const state = useEditorStore.getState();
    if (state.designId && state.fabricCanvas && !isReadOnly) {
      const thumbnailData = state.fabricCanvas.toDataURL({
        format: 'png',
        quality: 0.2,
        multiplier: 0.5
      });
      
      // Save immediately so the dashboard gets the correct recent thumbnail
      designAPI.update(state.designId, { 
        title: state.designTitle,
        jsonData: JSON.stringify(state.fabricCanvas.toJSON()),
        thumbnail: thumbnailData
      }).then(() => {
        state.markSaved();
        navigate('/dashboard');
      }).catch(() => {
        navigate('/dashboard');
      });
    } else {
      navigate('/dashboard');
    }
  };

  const updateActiveObj = (key, val) => {
    if (!selectedObject || !fabricCanvas) return;
    selectedObject.set(key, val);
    fabricCanvas.renderAll();
    saveSnapshot();
    setForceRender(prev => !prev);
  };

  const toggleActiveObj = (key, onVal, offVal) => {
    if (!selectedObject || !fabricCanvas) return;
    const current = selectedObject.get(key);
    selectedObject.set(key, current === onVal ? offVal : onVal);
    fabricCanvas.renderAll();
    saveSnapshot();
    setForceRender(prev => !prev);
  };

  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSendToPhoneModal, setShowSendToPhoneModal] = useState(false);
  const [currentShareUrl, setCurrentShareUrl] = useState('');

  const handleDownload = () => {
    if (!fabricCanvas) return;
    
    // Deselect active object to avoid including selection handles in download
    fabricCanvas.discardActiveObject();
    fabricCanvas.renderAll();

    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2 // High resolution download
    });

    const link = document.createElement('a');
    link.download = `${designTitle || 'untitled'}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Restore selection if any (optional, but cleaner)
    if (selectedObject) {
      fabricCanvas.setActiveObject(selectedObject);
      fabricCanvas.renderAll();
    }
    setShowDownloadOptions(false);
  };

  const handleDownloadPDF = () => {
    if (!fabricCanvas) return;
    
    fabricCanvas.discardActiveObject();
    fabricCanvas.renderAll();

    // Use a higher multiplier for better PDF quality
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 3
    });

    const pdf = new jsPDF({
      orientation: fabricCanvas.width > fabricCanvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [fabricCanvas.width, fabricCanvas.height]
    });

    pdf.addImage(dataURL, 'PNG', 0, 0, fabricCanvas.width, fabricCanvas.height);
    pdf.save(`${designTitle || 'untitled'}.pdf`);

    if (selectedObject) {
      fabricCanvas.setActiveObject(selectedObject);
      fabricCanvas.renderAll();
    }
    setShowDownloadOptions(false);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const [isUpdatingAccess, setIsUpdatingAccess] = useState(false);

  const ensureDesignSaved = async () => {
    // If design already has an ID, nothing to do
    if (useEditorStore.getState().designId) return useEditorStore.getState().designId;
    if (!fabricCanvas) return null;
    try {
      const response = await designAPI.create({
        title: designTitle || 'Untitled Design',
        jsonData: JSON.stringify(fabricCanvas.toJSON()),
        thumbnail: fabricCanvas.toDataURL({ format: 'png', quality: 0.1, multiplier: 0.2 })
      });
      const { id, title, accessLevel: al, ownerEmail: oe, isPublic: ip } = response.data;
      // Preserve all existing fields, only update id/title from server
      setDesign(id, title, al || 'ONLY_YOU', oe || null, ip || false);
      markSaved();
      navigate(`/editor?id=${id}`, { replace: true });
      return id;
    } catch (err) {
      console.error('Failed to auto-save design', err);
      return null;
    }
  };

  const handleAccessLevelChange = async (newLevel) => {
    setIsUpdatingAccess(true);
    try {
      const id = await ensureDesignSaved();
      if (!id) return;
      const response = await designAPI.updateAccessLevel(id, newLevel);
      const { id: rid, title, accessLevel: al, ownerEmail: oe, isPublic: ip } = response.data;
      setDesign(rid, title, al, oe, ip);
    } catch (err) {
      console.error('Failed to update access level', err);
    } finally {
      setIsUpdatingAccess(false);
    }
  };

  const handlePublicToggle = async () => {
    setIsUpdatingAccess(true);
    try {
      const id = await ensureDesignSaved();
      if (!id) return;
      // Read the latest isPublic from the store (not from closure, avoids stale state)
      const currentIsPublic = useEditorStore.getState().isPublic;
      const response = await designAPI.update(id, { isPublic: !currentIsPublic });
      const { id: rid, title, accessLevel: al, ownerEmail: oe, isPublic: ip } = response.data;
      setDesign(rid, title, al, oe, ip);
    } catch (err) {
      console.error('Failed to toggle public status', err);
    } finally {
      setIsUpdatingAccess(false);
    }
  };

  const handleCopyLink = async () => {
    if (!fabricCanvas) return null;
    const id = await ensureDesignSaved();
    if (!id) return null;
    const url = `${window.location.origin}/editor?id=${id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch (e) {
      // clipboard write failed silently
    }
    return url;
  };

  const handlePresent = () => {
    if (!fabricCanvas) return;
    
    fabricCanvas.discardActiveObject();
    fabricCanvas.renderAll();

    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });

    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>Presenting: ${designTitle || 'Untitled Design'}</title>
          <style>
            body { margin: 0; background: #000; display: flex; align-items: center; justify-content: center; min-height: 100vh; overflow: hidden; }
            img { max-width: 100%; max-height: 100vh; object-fit: contain; }
          </style>
        </head>
        <body>
          <img src="${dataURL}" alt="Presentation" />
        </body>
      </html>
    `);
    win.document.close();

    if (selectedObject) {
      fabricCanvas.setActiveObject(selectedObject);
      fabricCanvas.renderAll();
    }
  };

  const handleTitleChange = (e) => {
    setDesign(designId, e.target.value);
    useEditorStore.setState({ isSaved: false });
  };

  const renderContextToolbar = () => {
    if (isReadOnly) return <div className="px-4 text-sm font-semibold text-gray-400 flex items-center gap-2"><Lock className="w-3 h-3"/> View Only Mode</div>;
    if (!selectedObject) {
      return <span className="text-sm text-gray-500 italic px-4">Select an element to edit</span>;
    }

    const type = selectedObject.type;
    const isText = type === 'text' || type === 'i-text' || type === 'textbox';
    const isImage = type === 'image';

    return (
      <div className="flex items-center gap-4 px-4 h-full">
        {isText && (
          <>
            <input 
              type="number" 
              className="w-16 border border-gray-300 rounded px-2 py-1 text-sm text-center" 
              value={Math.round(selectedObject.fontSize || 16)} 
              onChange={e => updateActiveObj('fontSize', parseInt(e.target.value))}
            />
            <div className="flex gap-1 border border-gray-300 rounded p-0.5 bg-gray-50">
              <button onClick={() => toggleActiveObj('fontWeight', 'bold', 'normal')} className={`p-1 rounded ${selectedObject.fontWeight === 'bold' ? 'bg-gray-200' : 'hover:bg-gray-200'}`}><Bold className="w-4 h-4 text-gray-700"/></button>
              <button onClick={() => toggleActiveObj('fontStyle', 'italic', 'normal')} className={`p-1 rounded ${selectedObject.fontStyle === 'italic' ? 'bg-gray-200' : 'hover:bg-gray-200'}`}><Italic className="w-4 h-4 text-gray-700"/></button>
              <button onClick={() => toggleActiveObj('underline', true, false)} className={`p-1 rounded ${selectedObject.underline ? 'bg-gray-200' : 'hover:bg-gray-200'}`}><Underline className="w-4 h-4 text-gray-700"/></button>
            </div>
            <div className="h-6 w-6 rounded border border-gray-300 overflow-hidden relative">
              <input type="color" className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer" value={selectedObject.fill || '#000000'} onChange={e => updateActiveObj('fill', e.target.value)} />
            </div>
            <div className="flex gap-1 border border-gray-300 rounded p-0.5 bg-gray-50">
              <button onClick={() => updateActiveObj('textAlign', 'left')} className={`p-1 rounded ${selectedObject.textAlign === 'left' ? 'bg-gray-200' : 'hover:bg-gray-200'}`}><AlignLeft className="w-4 h-4 text-gray-700"/></button>
              <button onClick={() => updateActiveObj('textAlign', 'center')} className={`p-1 rounded ${selectedObject.textAlign === 'center' ? 'bg-gray-200' : 'hover:bg-gray-200'}`}><AlignCenter className="w-4 h-4 text-gray-700"/></button>
              <button onClick={() => updateActiveObj('textAlign', 'right')} className={`p-1 rounded ${selectedObject.textAlign === 'right' ? 'bg-gray-200' : 'hover:bg-gray-200'}`}><AlignRight className="w-4 h-4 text-gray-700"/></button>
            </div>
          </>
        )}

        {isImage && (
          <>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 font-semibold uppercase">Opacity</span>
              <input type="range" min="0" max="1" step="0.01" value={selectedObject.opacity || 1} onChange={e => updateActiveObj('opacity', parseFloat(e.target.value))} className="w-20" />
            </div>
            <div className="h-4 w-px bg-gray-300 mx-2" />
            <button onClick={() => toggleActiveObj('flipX', true, false)} className={`p-1.5 rounded hover:bg-gray-100 ${selectedObject.flipX ? 'bg-gray-200' : ''}`}><FlipHorizontal className="w-4 h-4 text-gray-700"/></button>
            <button onClick={() => toggleActiveObj('flipY', true, false)} className={`p-1.5 rounded hover:bg-gray-100 ${selectedObject.flipY ? 'bg-gray-200' : ''}`}><FlipVertical className="w-4 h-4 text-gray-700"/></button>
            <div className="h-4 w-px bg-gray-300 mx-2" />
            <span className="text-sm font-medium text-gray-600 cursor-pointer hover:text-purple-600">Image Filters</span>
          </>
        )}

        {(!isText && !isImage) && (
          <>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 font-semibold uppercase">Fill</span>
              <div className="h-6 w-6 rounded border border-gray-300 overflow-hidden relative">
                <input type="color" className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer" value={selectedObject.fill || '#000000'} onChange={e => updateActiveObj('fill', e.target.value)} />
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span className="text-xs text-gray-600 font-semibold uppercase">Stroke</span>
              <div className="h-6 w-6 rounded border border-gray-300 overflow-hidden relative">
                <input type="color" className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer" value={selectedObject.stroke || '#000000'} onChange={e => updateActiveObj('stroke', e.target.value)} />
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span className="text-xs text-gray-600 font-semibold uppercase">Weight</span>
              <input type="number" className="w-16 border border-gray-300 rounded px-2 py-1 text-sm text-center" value={selectedObject.strokeWidth || 0} onChange={e => updateActiveObj('strokeWidth', parseInt(e.target.value) || 0)} />
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span className="text-xs text-gray-600 font-semibold uppercase">Opacity</span>
              <input type="range" min="0" max="1" step="0.01" value={selectedObject.opacity !== undefined ? selectedObject.opacity : 1} onChange={e => updateActiveObj('opacity', parseFloat(e.target.value))} className="w-20" />
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 overflow-hidden font-sans">
      
      {/* 1. TOP NAVBAR */}
      <header className="h-[52px] bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-20 relative">
        <div className="flex items-center gap-4 w-1/3">
          <button onClick={handleBackToDashboard} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">CanvaClone</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <input 
            type="text" 
            value={designTitle} 
            onChange={handleTitleChange}
            className="text-center font-bold text-gray-900 border border-transparent hover:border-gray-300 focus:border-purple-500 focus:bg-white rounded px-2 py-1 outline-none transition-all w-64 bg-transparent"
          />
        </div>

        <div className="flex items-center justify-end gap-3 w-1/3">
          <span className="text-xs font-medium text-gray-400 w-16 text-right mr-2">
            {isSaved ? 'Saved ✓' : 'Saving...'}
          </span>
          <div className="flex gap-1">
            <button onClick={undo} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors"><Undo className="w-4 h-4" /></button>
            <button onClick={redo} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors"><Redo className="w-4 h-4" /></button>
          </div>
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded font-semibold text-sm text-gray-700 transition-colors"
          >
            <Share className="w-4 h-4" /> Share
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowDownloadOptions(!showDownloadOptions)}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded font-semibold text-sm text-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" /> Download <ChevronDown className={`w-3 h-3 transition-transform ${showDownloadOptions ? 'rotate-180' : ''}`} />
            </button>
            
            {showDownloadOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-[100] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <button 
                  onClick={handleDownload}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">PNG</div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Download PNG</p>
                    <p className="text-[10px] text-gray-500 font-medium">Best for web sharing</p>
                  </div>
                </button>
                <button 
                  onClick={handleDownloadPDF}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs">PDF</div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Download PDF</p>
                    <p className="text-[10px] text-gray-500 font-medium">Best for printing</p>
                  </div>
                </button>
              </div>
            )}
          </div>
          <button 
            onClick={handlePresent}
            className="flex items-center gap-2 px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold text-sm shadow-sm transition-colors ml-1"
          >
            <Play className="w-4 h-4" /> Present
          </button>
        </div>
      </header>

      {/* 2. CONTEXT TOOLBAR */}
      <div className="h-[44px] bg-white border-b border-gray-200 flex items-center shrink-0 z-10 shadow-sm">
        {renderContextToolbar()}
      </div>

      {/* 3. MAIN BODY */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* A. LEFT ICON RAIL */}
        <aside className="w-[72px] bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-2 z-10 shadow-sm shrink-0">
          {[
            { id: 'elements', icon: Grid, label: 'Elements' },
            { id: 'text', icon: Type, label: 'Text' },
            { id: 'uploads', icon: UploadCloud, label: 'Uploads' },
            { id: 'photos', icon: ImageIcon, label: 'Photos' },
            { id: 'brand', icon: Crown, label: 'Brand' }
          ].map(item => {
            const Icon = item.icon;
            const isActive = activePanel === item.id;
            return (
              <button 
                key={item.id} 
                onClick={() => setActivePanel(item.id)}
                className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all group ${isActive ? 'bg-purple-50' : 'hover:bg-gray-50'}`}
              >
                <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-purple-600' : 'text-gray-600 group-hover:text-purple-600'}`} />
                <span className={`text-[10px] font-semibold ${isActive ? 'text-purple-700' : 'text-gray-500 group-hover:text-purple-600'}`}>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* B. SUB PANEL */}
        <aside className="w-[300px] bg-white border-r border-gray-200 flex flex-col z-10 shrink-0 relative overflow-hidden shadow-sm">
          {!isReadOnly ? (
            <>
              {activePanel === 'elements' && <ElementsPanel />}
              {activePanel === 'text' && <TextPanel />}
              {activePanel === 'uploads' && <UploadPanel />}
              {activePanel === 'photos' && <PhotosPanel />}
              {activePanel === 'brand' && <BrandPanel />}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
              <div className="w-16 h-16 rounded-3xl bg-white shadow-sm flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">View Only Mode</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                You don't have permission to edit this design. Please contact the owner to request access.
              </p>
            </div>
          )}
        </aside>

        {/* C. CANVAS AREA */}
        <section className="flex-1 flex flex-col relative overflow-hidden bg-[#e5e7eb] bg-opacity-50">
          <div className="flex-1 overflow-auto flex items-center justify-center p-8 custom-scrollbar">
            {/* The canvas container */}
            <div className="bg-white shadow-2xl transition-transform duration-200" style={{ transform: `scale(${zoom})` }}>
              <canvas id="editor-canvas" ref={canvasRef} />
            </div>
          </div>

          {/* Bottom Zoom Bar */}
          <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-200 flex items-center gap-4 text-sm font-semibold text-gray-700">
            <button onClick={() => setZoom(Math.max(0.1, zoom - 0.1))} className="hover:bg-gray-100 w-6 h-6 rounded flex items-center justify-center">-</button>
            <span className="w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(Math.min(5, zoom + 0.1))} className="hover:bg-gray-100 w-6 h-6 rounded flex items-center justify-center">+</button>
            <div className="w-px h-4 bg-gray-300 mx-1" />
            <span>Page 1/1</span>
          </div>
        </section>

        {/* D. RIGHT PROPERTIES PANEL */}
        <aside className="w-[240px] bg-white border-l border-gray-200 flex flex-col z-10 shrink-0 shadow-sm">
          <div className="flex border-b border-gray-200">
            <button onClick={() => setRightTab('design')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${rightTab === 'design' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}>Design</button>
            <button onClick={() => setRightTab('animate')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${rightTab === 'animate' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}>Animate</button>
          </div>

          <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
            {rightTab === 'design' ? (
              <div className="space-y-6">
                {!selectedObject ? (
                  <div className="text-center text-sm text-gray-400 mt-10">Select an object to edit its position and size</div>
                ) : (
                  <>
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Position</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-gray-500 font-bold mb-1 block">X</label>
                          <input type="number" value={Math.round(selectedObject.left || 0)} onChange={e => updateActiveObj('left', parseInt(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-purple-500" />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 font-bold mb-1 block">Y</label>
                          <input type="number" value={Math.round(selectedObject.top || 0)} onChange={e => updateActiveObj('top', parseInt(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-purple-500" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Size & Rotation</h4>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="text-[10px] text-gray-500 font-bold mb-1 block">WIDTH</label>
                          <input type="number" value={Math.round((selectedObject.width || 0) * (selectedObject.scaleX || 1))} onChange={e => {
                            const newW = parseInt(e.target.value);
                            updateActiveObj('scaleX', newW / (selectedObject.width || 1));
                          }} className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-purple-500" />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 font-bold mb-1 block">HEIGHT</label>
                          <input type="number" value={Math.round((selectedObject.height || 0) * (selectedObject.scaleY || 1))} onChange={e => {
                            const newH = parseInt(e.target.value);
                            updateActiveObj('scaleY', newH / (selectedObject.height || 1));
                          }} className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-purple-500" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 font-bold mb-1 block">ROTATION (DEG)</label>
                        <input type="number" value={Math.round(selectedObject.angle || 0)} onChange={e => updateActiveObj('angle', parseInt(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-purple-500" />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Layer Opacity</h4>
                      <input type="range" min="0" max="1" step="0.01" value={selectedObject.opacity !== undefined ? selectedObject.opacity : 1} onChange={e => updateActiveObj('opacity', parseFloat(e.target.value))} className="w-full accent-purple-600" />
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center text-sm text-gray-400 mt-10">Animation presets coming soon...</div>
            )}
          </div>
        </aside>

      </main>

      {/* 4. SHARE MODAL (CANVA STYLE) */}
      {showShareModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowShareModal(false)}></div>
          
          <div className="relative w-full max-w-[400px] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Share this design</h2>
                <button onClick={() => setShowShareModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Access Level Dropdown */}
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Access level</label>
                <div className="relative group/dropdown">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {accessLevel === 'ONLY_YOU' ? <Lock className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
                  </div>
                  <select 
                    value={accessLevel}
                    onChange={(e) => handleAccessLevelChange(e.target.value)}
                    disabled={isUpdatingAccess}
                    className="w-full appearance-none bg-white py-4 pl-12 pr-12 border border-gray-200 rounded-2xl hover:border-purple-300 transition-all cursor-pointer font-bold text-gray-900 outline-none focus:ring-2 focus:ring-purple-100 disabled:opacity-50"
                  >
                    <option value="ONLY_YOU">Only you can access</option>
                    <option value="PUBLIC_VIEW">Anyone with link (view only)</option>
                    <option value="PUBLIC_EDIT">Anyone with link (can edit)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover/dropdown:text-purple-500 transition-colors">
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </div>
                {isUpdatingAccess && <p className="text-[10px] text-purple-600 font-bold mt-2 ml-1 animate-pulse">Saving changes...</p>}
              </div>

              {/* Public Link Toggle */}
              <div className="mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPublic ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                      <Play className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Public gallery</p>
                      <p className="text-[10px] text-gray-500">Show this design in the community explore page</p>
                    </div>
                  </div>
                  <button 
                    onClick={handlePublicToggle}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isPublic ? 'bg-purple-600' : 'bg-gray-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${isPublic ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              {/* Copy Link Button Component */}
              <div className="mb-4">
                <CopyLinkButton designId={designId} onBeforeCopy={handleCopyLink} />
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-xl transition-colors mb-6 group">
                Create custom link <Crown className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              </button>

              <div className="h-px bg-gray-100 w-full mb-8"></div>

              {/* Share Grid */}
              <div className="grid grid-cols-4 gap-y-8 gap-x-4 pb-4">
                {[
                  { icon: Download, label: 'Download', color: 'bg-gray-100', iconColor: 'text-gray-700', onClick: () => { setShowShareModal(false); setShowDownloadOptions(true); } },
                  { icon: Image, label: 'Instagram', color: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600', iconColor: 'text-white' },
                  { icon: Link2, label: 'Public link', color: 'bg-gray-100', iconColor: 'text-gray-700' },
                  { icon: Calendar, label: 'Schedule', color: 'bg-gray-100', iconColor: 'text-gray-700', premium: true },
                  { icon: Folder, label: 'Move', color: 'bg-gray-100', iconColor: 'text-gray-700' },
                  { icon: Smartphone, label: 'Send/Email', color: 'bg-gray-100', iconColor: 'text-gray-700', onClick: async () => {
                    const url = await handleCopyLink();
                    if (url) {
                      setCurrentShareUrl(url);
                      setShowSendToPhoneModal(true);
                    }
                  }},
                  { icon: Share, label: 'Meta Ads', color: 'bg-blue-600', iconColor: 'text-white' },
                  { icon: MoreHorizontal, label: 'See all', color: 'bg-gray-100', iconColor: 'text-gray-700' },
                ].map((item, idx) => (
                  <button key={idx} onClick={item.onClick} className="flex flex-col items-center gap-2 group">
                    <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${item.color}`}>
                      <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                      {item.premium && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                          <Crown className="w-3 h-3 text-amber-400" />
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-gray-500 text-center leading-tight group-hover:text-gray-900 transition-colors">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
 
      {showSendToPhoneModal && (
        <SendToPhoneModal 
          designId={designId}
          shareUrl={currentShareUrl}
          onClose={() => setShowSendToPhoneModal(false)}
        />
      )}
    </div>
  );
};

export default EditorPage;
