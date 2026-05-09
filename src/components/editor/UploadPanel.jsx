import React, { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import useEditorStore from '../../store/useEditorStore';
import api, { uploadAPI } from '../../api/client';
import { UploadCloud, Trash2, FlipHorizontal, FlipVertical, Wand2, Plus, Loader2 } from 'lucide-react';

const UploadPanel = () => {
  const { fabricCanvas, saveSnapshot } = useEditorStore();
  const fileInputRef = useRef(null);

  const [uploads, setUploads] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [activeImageObj, setActiveImageObj] = useState(null);
  const [filterVals, setFilterVals] = useState({ brightness: 0, contrast: 0, saturation: 0 });
  const [removingBg, setRemovingBg] = useState(false);

  // Session state for uploads (since backend doesn't persist gallery files)
  useEffect(() => {
    // Initializing empty local gallery
    setUploads([]);
  }, []);

  // Track active image object on canvas
  useEffect(() => {
    if (!fabricCanvas) return;

    const updateActiveImage = () => {
      const activeObj = fabricCanvas.getActiveObject();
      if (activeObj && activeObj.type === 'image') {
        setActiveImageObj(activeObj);
        
        // Initialize local filter states based on the image's current filters
        let br = 0, co = 0, sa = 0;
        if (activeObj.filters) {
          activeObj.filters.forEach(f => {
            if (f.type === 'Brightness') br = f.brightness;
            if (f.type === 'Contrast') co = f.contrast;
            if (f.type === 'Saturation') sa = f.saturation;
          });
        }
        setFilterVals({ brightness: br, contrast: co, saturation: sa });
      } else {
        setActiveImageObj(null);
      }
    };

    fabricCanvas.on('selection:created', updateActiveImage);
    fabricCanvas.on('selection:updated', updateActiveImage);
    fabricCanvas.on('selection:cleared', updateActiveImage);
    fabricCanvas.on('object:modified', updateActiveImage);

    updateActiveImage(); // Initial check

    return () => {
      fabricCanvas.off('selection:created', updateActiveImage);
      fabricCanvas.off('selection:updated', updateActiveImage);
      fabricCanvas.off('selection:cleared', updateActiveImage);
      fabricCanvas.off('object:modified', updateActiveImage);
    };
  }, [fabricCanvas]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // CANVA-LIKE UX OPTIMIZATION: 
    // Create a local data URL fallback so the user can immediately work with the image 
    // even if the backend Cloudinary connection fails.
    const reader = new FileReader();
    reader.onload = (e) => {
      const localUrl = e.target.result;
      const localUpload = {
        id: `local-${Date.now()}`,
        url: localUrl,
        filename: file.name
      };
      setUploads(prev => [localUpload, ...prev]);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    setProgress(0);

    try {
      const response = await api.post('/api/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });
      
      // Replace the local placeholder with backend persistent data if successful
      const serverUrl = response.data.secure_url || response.data.url;
      if (serverUrl) {
        setUploads(prev => prev.map(u => 
          u.filename === file.name ? { id: response.data.public_id || u.id, url: serverUrl } : u
        ));
      }
    } catch (error) {
      console.warn("Cloudinary backend upload failed. Continuing safely with offline local preview.");
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent triggering "add to canvas"
    try {
      await uploadAPI.delete(id);
      setUploads(prev => prev.filter(u => u.id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const getImageUrl = (item) => {
    if (item.url) return item.url;
    if (item.filename) {
      const backendUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8080';
      return `${backendUrl}/api/uploads/files/${item.filename}`;
    }
    return '';
  };

  const handleAddToCanvas = (url) => {
    if (!fabricCanvas || !url) return;

    fabric.Image.fromURL(
      url,
      (img) => {
        img.scaleToWidth(300);
        fabricCanvas.add(img);
        fabricCanvas.centerObject(img);
        fabricCanvas.setActiveObject(img);
        fabricCanvas.renderAll();
        saveSnapshot();
      },
      { crossOrigin: 'anonymous' }
    );
  };

  const applyFilters = (type, value) => {
    if (!activeImageObj) return;

    const newVals = { ...filterVals, [type]: parseFloat(value) };
    setFilterVals(newVals);

    const filters = [];
    if (newVals.brightness !== 0) {
      filters.push(new fabric.Image.filters.Brightness({ brightness: newVals.brightness }));
    }
    if (newVals.contrast !== 0) {
      filters.push(new fabric.Image.filters.Contrast({ contrast: newVals.contrast }));
    }
    if (newVals.saturation !== 0) {
      filters.push(new fabric.Image.filters.Saturation({ saturation: newVals.saturation }));
    }

    activeImageObj.filters = filters;
    activeImageObj.applyFilters();
    fabricCanvas.renderAll();
    // In a production app, you might want to debounce the saveSnapshot on slider changes
  };

  const handleSliderMouseUp = () => {
    saveSnapshot(); // Save snapshot only when user releases slider
  };

  const toggleFlip = (prop) => {
    if (!activeImageObj) return;
    activeImageObj.set(prop, !activeImageObj[prop]);
    fabricCanvas.renderAll();
    saveSnapshot();
    // Force component update to reflect button states if needed
    setFilterVals(prev => ({ ...prev }));
  };

  const updateOpacity = (val) => {
    if (!activeImageObj) return;
    activeImageObj.set('opacity', parseFloat(val) / 100);
    fabricCanvas.renderAll();
  };

  const handleRemoveBg = async () => {
    if (!activeImageObj || !activeImageObj.getSrc) return;
    const currentUrl = activeImageObj.getSrc();
    if (!currentUrl) return;

    setRemovingBg(true);
    try {
      const response = await api.post('/api/remove-bg', { imageUrl: currentUrl });
      const newUrl = response.data.url || response.data; // Adjust based on your actual backend response
      
      fabric.Image.fromURL(
        newUrl,
        (img) => {
          // Map properties from old image to new image
          img.set({
            left: activeImageObj.left,
            top: activeImageObj.top,
            scaleX: activeImageObj.scaleX,
            scaleY: activeImageObj.scaleY,
            angle: activeImageObj.angle,
            flipX: activeImageObj.flipX,
            flipY: activeImageObj.flipY,
            originX: activeImageObj.originX,
            originY: activeImageObj.originY,
            opacity: activeImageObj.opacity
          });
          
          fabricCanvas.remove(activeImageObj);
          fabricCanvas.add(img);
          fabricCanvas.setActiveObject(img);
          fabricCanvas.renderAll();
          saveSnapshot();
        },
        { crossOrigin: 'anonymous' }
      );
    } catch (err) {
      console.error("Remove BG failed", err);
      alert("Failed to remove background.");
    } finally {
      setRemovingBg(false);
    }
  };

  // ----------------------------------------------------------------------
  // Render Edit Mode (If image is selected)
  // ----------------------------------------------------------------------
  if (activeImageObj) {
    return (
      <div className="w-full h-full flex flex-col bg-gray-50 overflow-y-auto custom-scrollbar p-4">
        <h3 className="font-bold text-gray-900 mb-6">Image Controls</h3>

        <div className="space-y-6">
          {/* AI Tools */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Magic Tools</label>
            <button 
              onClick={handleRemoveBg}
              disabled={removingBg}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {removingBg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              {removingBg ? 'Processing...' : 'Remove Background'}
            </button>
          </div>

          {/* Flip Controls */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Flip</label>
            <div className="flex gap-2">
              <button 
                onClick={() => toggleFlip('flipX')}
                className={`flex-1 flex justify-center py-2 border rounded-md transition-colors ${activeImageObj.flipX ? 'bg-purple-100 border-purple-200 text-purple-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                <FlipHorizontal className="w-4 h-4" />
              </button>
              <button 
                onClick={() => toggleFlip('flipY')}
                className={`flex-1 flex justify-center py-2 border rounded-md transition-colors ${activeImageObj.flipY ? 'bg-purple-100 border-purple-200 text-purple-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                <FlipVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Opacity */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex justify-between">
              <span>Opacity</span>
              <span className="text-gray-900">{Math.round((activeImageObj.get('opacity') || 1) * 100)}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round((activeImageObj.get('opacity') || 1) * 100)}
              onChange={(e) => updateOpacity(e.target.value)}
              onMouseUp={handleSliderMouseUp}
              onTouchEnd={handleSliderMouseUp}
              className="w-full accent-purple-600"
            />
          </div>

          <div className="h-px bg-gray-200 w-full my-2"></div>

          {/* Filters */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 block">Filters</label>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 flex justify-between">
                  <span>Brightness</span>
                  <span>{Math.round(filterVals.brightness * 100)}</span>
                </label>
                <input
                  type="range" min="-1" max="1" step="0.01"
                  value={filterVals.brightness}
                  onChange={(e) => applyFilters('brightness', e.target.value)}
                  onMouseUp={handleSliderMouseUp}
                  onTouchEnd={handleSliderMouseUp}
                  className="w-full accent-purple-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 flex justify-between">
                  <span>Contrast</span>
                  <span>{Math.round(filterVals.contrast * 100)}</span>
                </label>
                <input
                  type="range" min="-1" max="1" step="0.01"
                  value={filterVals.contrast}
                  onChange={(e) => applyFilters('contrast', e.target.value)}
                  onMouseUp={handleSliderMouseUp}
                  onTouchEnd={handleSliderMouseUp}
                  className="w-full accent-purple-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 flex justify-between">
                  <span>Saturation</span>
                  <span>{Math.round(filterVals.saturation * 100)}</span>
                </label>
                <input
                  type="range" min="-1" max="1" step="0.01"
                  value={filterVals.saturation}
                  onChange={(e) => applyFilters('saturation', e.target.value)}
                  onMouseUp={handleSliderMouseUp}
                  onTouchEnd={handleSliderMouseUp}
                  className="w-full accent-purple-600"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // Render Upload Mode (If no image is selected)
  // ----------------------------------------------------------------------
  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      <div className="p-4 border-b border-gray-200 shrink-0 bg-white">
        <h3 className="font-bold text-gray-900 mb-4">Uploads</h3>
        
        {/* Dropzone / Upload Area */}
        <div 
          onClick={handleUploadClick}
          className="border-2 border-dashed border-purple-300 bg-purple-50 hover:bg-purple-100 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center relative overflow-hidden"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/png, image/jpeg, image/gif, image/webp, image/svg+xml"
            className="hidden" 
          />
          
          {uploading ? (
            <div className="flex flex-col items-center w-full z-10">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-2" />
              <p className="text-sm font-semibold text-purple-700 mb-1">Uploading...</p>
              <div className="w-full bg-purple-200 rounded-full h-1.5 mt-2">
                <div className="bg-purple-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          ) : (
            <>
              <UploadCloud className="w-8 h-8 text-purple-500 mb-2" />
              <p className="text-sm font-semibold text-gray-700">Drag files here or click to upload</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
            </>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {uploads.length === 0 && !uploading ? (
          <div className="text-center text-gray-400 mt-10 text-sm">
            <p>No uploads yet.</p>
            <p>Your uploaded media will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-20">
            {uploads.map((item) => (
              <div 
                key={item.id} 
                className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleAddToCanvas(getImageUrl(item))}
              >
                <img 
                  src={getImageUrl(item)} 
                  alt={item.filename || 'Upload'} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  crossOrigin="anonymous"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                  <div className="w-8 h-8 bg-white text-gray-900 rounded-full flex items-center justify-center font-bold mb-auto mt-2 pointer-events-none">
                    <Plus className="w-5 h-5" />
                  </div>
                  <button 
                    onClick={(e) => handleDelete(e, item.id)}
                    className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md mt-auto mb-2 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPanel;
