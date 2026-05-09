import React, { useEffect, useState } from 'react';
import useEditorStore from '../../store/useEditorStore';
import { 
  Lock, Unlock, Copy, ClipboardPaste, Trash2, 
  ArrowUpToLine, ArrowDownToLine, ArrowUp, ArrowDown, 
  Settings, Layers, CopyPlus 
} from 'lucide-react';

const PropertiesPanel = () => {
  const { fabricCanvas, selectedObject, setSelectedObject, saveSnapshot } = useEditorStore();
  
  const [vals, setVals] = useState({
    x: 0, y: 0, w: 0, h: 0, angle: 0, opacity: 1, fill: '#000000', stroke: '#000000', strokeWidth: 0
  });
  
  const [lockRatio, setLockRatio] = useState(true);
  const [clipboard, setClipboard] = useState(null);
  const [, setTrigger] = useState(false); // For forcing re-renders

  // Sync inputs with selectedObject
  useEffect(() => {
    if (!selectedObject) return;

    const updateLocalState = () => {
      setVals({
        x: Math.round(selectedObject.left || 0),
        y: Math.round(selectedObject.top || 0),
        w: Math.round((selectedObject.width || 0) * (selectedObject.scaleX || 1)),
        h: Math.round((selectedObject.height || 0) * (selectedObject.scaleY || 1)),
        angle: Math.round(selectedObject.angle || 0),
        opacity: selectedObject.opacity !== undefined ? selectedObject.opacity : 1,
        fill: selectedObject.fill || '#000000',
        stroke: selectedObject.stroke || '#000000',
        strokeWidth: selectedObject.strokeWidth || 0
      });
    };

    updateLocalState();
    
    selectedObject.on('modified', updateLocalState);
    selectedObject.on('scaling', updateLocalState);
    selectedObject.on('moving', updateLocalState);
    selectedObject.on('rotating', updateLocalState);

    return () => {
      selectedObject.off('modified', updateLocalState);
      selectedObject.off('scaling', updateLocalState);
      selectedObject.off('moving', updateLocalState);
      selectedObject.off('rotating', updateLocalState);
    };
  }, [selectedObject]);

  if (!selectedObject) {
    return (
      <div className="w-[220px] h-full bg-white border-l border-gray-200 flex flex-col items-center justify-center p-6 text-center text-gray-400">
        <Settings className="w-12 h-12 mb-4 text-gray-300" />
        <p className="text-sm">Select an element to see its properties</p>
      </div>
    );
  }

  // Value updaters
  const updateObj = (key, value) => {
    selectedObject.set(key, value);
    fabricCanvas.renderAll();
    saveSnapshot();
    setTrigger(prev => !prev);
  };

  const updateWidth = (w) => {
    if (lockRatio) {
      selectedObject.scaleToWidth(w);
    } else {
      selectedObject.set('scaleX', w / (selectedObject.width || 1));
    }
    fabricCanvas.renderAll();
    saveSnapshot();
    setTrigger(prev => !prev);
  };

  const updateHeight = (h) => {
    if (lockRatio) {
      selectedObject.scaleToHeight(h);
    } else {
      selectedObject.set('scaleY', h / (selectedObject.height || 1));
    }
    fabricCanvas.renderAll();
    saveSnapshot();
    setTrigger(prev => !prev);
  };

  // Layer Order
  const handleLayer = (action) => {
    if (action === 'forward') fabricCanvas.bringForward(selectedObject);
    if (action === 'backward') fabricCanvas.sendBackwards(selectedObject);
    if (action === 'front') fabricCanvas.bringToFront(selectedObject);
    if (action === 'back') fabricCanvas.sendToBack(selectedObject);
    fabricCanvas.renderAll();
    saveSnapshot();
  };

  // Actions
  const handleDuplicate = () => {
    selectedObject.clone((clonedObj) => {
      fabricCanvas.discardActiveObject();
      clonedObj.set({
        left: clonedObj.left + 10,
        top: clonedObj.top + 10,
        evented: true,
      });
      fabricCanvas.add(clonedObj);
      fabricCanvas.setActiveObject(clonedObj);
      setSelectedObject(clonedObj);
      fabricCanvas.renderAll();
      saveSnapshot();
    });
  };

  const handleDelete = () => {
    fabricCanvas.remove(selectedObject);
    fabricCanvas.discardActiveObject();
    setSelectedObject(null);
    fabricCanvas.renderAll();
    saveSnapshot();
  };

  const handleCopy = () => {
    selectedObject.clone((cloned) => {
      setClipboard(cloned);
    });
  };

  const handlePaste = () => {
    if (!clipboard) return;
    clipboard.clone((clonedObj) => {
      fabricCanvas.discardActiveObject();
      clonedObj.set({
        left: clonedObj.left + 10,
        top: clonedObj.top + 10,
        evented: true,
      });
      fabricCanvas.add(clonedObj);
      setClipboard(clonedObj);
      fabricCanvas.setActiveObject(clonedObj);
      setSelectedObject(clonedObj);
      fabricCanvas.renderAll();
      saveSnapshot();
    });
  };

  return (
    <div className="w-[220px] h-full bg-white border-l border-gray-200 flex flex-col overflow-y-auto custom-scrollbar shrink-0 shadow-sm">
      
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <h3 className="font-bold text-gray-900 text-sm">Properties</h3>
        <Settings className="w-4 h-4 text-gray-500" />
      </div>

      <div className="p-4 space-y-6">
        
        {/* 1. POSITION & SIZE */}
        <section>
          <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Position & Size</h4>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-[10px] text-gray-500 font-bold mb-1 block">X</label>
              <input 
                type="number" 
                value={vals.x} 
                onChange={e => updateObj('left', parseInt(e.target.value))} 
                className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-purple-500 focus:bg-white transition-colors" 
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 font-bold mb-1 block">Y</label>
              <input 
                type="number" 
                value={vals.y} 
                onChange={e => updateObj('top', parseInt(e.target.value))} 
                className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-purple-500 focus:bg-white transition-colors" 
              />
            </div>
          </div>

          <div className="flex gap-2 items-center mb-3">
            <div className="grid grid-cols-2 gap-3 flex-1">
              <div>
                <label className="text-[10px] text-gray-500 font-bold mb-1 block">W</label>
                <input 
                  type="number" 
                  value={vals.w} 
                  onChange={e => updateWidth(parseInt(e.target.value))} 
                  className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-purple-500 focus:bg-white transition-colors" 
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 font-bold mb-1 block">H</label>
                <input 
                  type="number" 
                  value={vals.h} 
                  onChange={e => updateHeight(parseInt(e.target.value))} 
                  className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-purple-500 focus:bg-white transition-colors" 
                />
              </div>
            </div>
            <button 
              onClick={() => setLockRatio(!lockRatio)}
              className={`p-1.5 rounded mt-4 transition-colors ${lockRatio ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:bg-gray-100'}`}
              title="Lock aspect ratio"
            >
              {lockRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </button>
          </div>

          <div>
            <label className="text-[10px] text-gray-500 font-bold mb-1 block">ROTATION</label>
            <div className="relative">
              <input 
                type="number" 
                value={vals.angle} 
                onChange={e => updateObj('angle', parseInt(e.target.value))} 
                className="w-full bg-gray-50 border border-gray-200 rounded pl-2 pr-6 py-1.5 text-sm outline-none focus:border-purple-500 focus:bg-white transition-colors" 
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">°</span>
            </div>
          </div>
        </section>

        <div className="h-px bg-gray-100 w-full" />

        {/* 2. APPEARANCE */}
        <section>
          <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Appearance</h4>
          
          <div className="mb-4">
            <label className="text-[10px] text-gray-500 font-bold mb-1 flex justify-between">
              <span>OPACITY</span>
              <span className="text-gray-900">{Math.round(vals.opacity * 100)}%</span>
            </label>
            <input 
              type="range" 
              min="0" max="100" 
              value={Math.round(vals.opacity * 100)} 
              onChange={e => updateObj('opacity', parseInt(e.target.value) / 100)} 
              className="w-full accent-purple-600" 
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-[10px] text-gray-500 font-bold mb-1 block">FILL</label>
              <div className="h-8 w-full rounded border border-gray-300 overflow-hidden relative cursor-pointer shadow-sm">
                <input 
                  type="color" 
                  value={vals.fill} 
                  onChange={e => updateObj('fill', e.target.value)} 
                  className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer" 
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 font-bold mb-1 block">STROKE</label>
              <div className="h-8 w-full rounded border border-gray-300 overflow-hidden relative cursor-pointer shadow-sm">
                <input 
                  type="color" 
                  value={vals.stroke} 
                  onChange={e => updateObj('stroke', e.target.value)} 
                  className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer" 
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-gray-500 font-bold mb-1 block">STROKE WIDTH</label>
            <input 
              type="number" 
              min="0"
              value={vals.strokeWidth} 
              onChange={e => updateObj('strokeWidth', parseInt(e.target.value))} 
              className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-purple-500 focus:bg-white transition-colors" 
            />
          </div>
        </section>

        <div className="h-px bg-gray-100 w-full" />

        {/* 3. LAYER ORDER */}
        <section>
          <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1">
            <Layers className="w-3 h-3" /> Layer Order
          </h4>
          
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => handleLayer('forward')} className="flex items-center justify-center gap-1 bg-gray-50 border border-gray-200 py-1.5 rounded text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all">
              <ArrowUp className="w-3 h-3" /> Forward
            </button>
            <button onClick={() => handleLayer('backward')} className="flex items-center justify-center gap-1 bg-gray-50 border border-gray-200 py-1.5 rounded text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all">
              <ArrowDown className="w-3 h-3" /> Backward
            </button>
            <button onClick={() => handleLayer('front')} className="flex items-center justify-center gap-1 bg-gray-50 border border-gray-200 py-1.5 rounded text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all">
              <ArrowUpToLine className="w-3 h-3" /> Front
            </button>
            <button onClick={() => handleLayer('back')} className="flex items-center justify-center gap-1 bg-gray-50 border border-gray-200 py-1.5 rounded text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all">
              <ArrowDownToLine className="w-3 h-3" /> Back
            </button>
          </div>
        </section>

        <div className="h-px bg-gray-100 w-full" />

        {/* 4. ACTIONS */}
        <section className="pb-6">
          <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Actions</h4>
          
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button onClick={handleCopy} className="flex items-center justify-center gap-1.5 bg-gray-50 border border-gray-200 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-all">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
            <button onClick={handlePaste} disabled={!clipboard} className="flex items-center justify-center gap-1.5 bg-gray-50 border border-gray-200 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-all disabled:opacity-50 disabled:hover:bg-gray-50 disabled:hover:text-gray-700 disabled:hover:border-gray-200">
              <ClipboardPaste className="w-3.5 h-3.5" /> Paste
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button onClick={handleDuplicate} className="flex items-center justify-center gap-1.5 bg-gray-50 border border-gray-200 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-all">
              <CopyPlus className="w-3.5 h-3.5" /> Duplicate
            </button>
            <button onClick={handleDelete} className="flex items-center justify-center gap-1.5 bg-red-50 border border-red-200 py-2 rounded-lg text-xs font-bold text-red-600 hover:bg-red-100 hover:border-red-300 transition-all">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default PropertiesPanel;
