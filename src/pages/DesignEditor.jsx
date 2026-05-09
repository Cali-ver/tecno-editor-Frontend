import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Circle, Transformer } from 'react-konva';
import { Icon } from '../components/common';

const DesignEditor = ({ design, onBack }) => {
  const [elements, setElements] = useState([
    { id: 'rect1', type: 'rect', x: 50, y: 50, width: 100, height: 100, fill: '#8b3dff', draggable: true },
    { id: 'text1', type: 'text', x: 200, y: 150, text: 'Hello Konva!', fontSize: 30, fill: '#333', draggable: true },
    { id: 'circle1', type: 'circle', x: 400, y: 300, radius: 50, fill: '#00c4cc', draggable: true },
  ]);

  const [selectedId, selectShape] = useState(null);
  const trRef = useRef();
  const stageRef = useRef();

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  useEffect(() => {
    if (selectedId) {
      // we need to attach transformer manually
      const node = stageRef.current.findOne('#' + selectedId);
      if (node) {
        trRef.current.nodes([node]);
        trRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedId]);

  return (
    <div className="h-screen flex flex-col bg-[#f2f3f5] overflow-hidden font-sans">
      {/* Editor Header (Gradient) */}
      <header className="h-14 bg-gradient-to-r from-[#00c4cc] to-[#8b3dff] flex items-center justify-between px-4 shrink-0 text-white">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-md transition-all"
            title="Home"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          </button>
          
          <button className="font-semibold text-sm hover:bg-white/10 px-2 py-1 rounded transition-colors">File</button>
          <button className="font-semibold text-sm hover:bg-white/10 px-2 py-1 rounded transition-colors">Resize</button>
          
          <button className="flex items-center gap-1 font-semibold text-sm hover:bg-white/10 px-2 py-1 rounded transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
            Editing
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
          </button>

          <div className="flex items-center gap-1 opacity-80">
            <button className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
            </button>
            <button className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"/></svg>
            </button>
            <button className="p-1.5 hover:bg-white/20 rounded-full transition-colors relative ml-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4"/></svg>
              <span className="absolute -top-2 -right-2 bg-pink-500 text-[8px] font-bold px-1 rounded-sm">New</span>
            </button>
          </div>
        </div>

        {/* Center Title */}
        <div className="flex-1 flex justify-center px-4">
          <h2 className="font-semibold text-sm truncate max-w-[400px] cursor-pointer hover:underline">
            {design?.title || 'Beige Black White Handwritten Photo Boy Gender Reveal In...'}
          </h2>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-md font-semibold text-sm transition-colors">
            <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-.966.744H8a1 1 0 01-.967-.744l-1.18-4.455-3.354-1.935a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 018 2h4zm-1.288 2.052L9.8 8.016a1 1 0 01-.818.73l-4.14.364 3.12 2.684a1 1 0 01.328.956l-.916 4.02 3.52-2.15a1 1 0 011.012 0l3.52 2.15-.916-4.02a1 1 0 01.328-.956l3.12-2.684-4.14-.364a1 1 0 01-.818-.73l-.912-3.964z" clipRule="evenodd" /></svg>
            Start your trial for ₹0
          </button>
          
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center font-bold text-sm border-2 border-white/20">
            VK
          </div>
          
          <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
          </button>

          <button className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-md transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          </button>
          
          <button className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-md transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          </button>

          <button className="bg-white text-gray-900 hover:bg-gray-100 px-4 py-1.5 rounded-md font-bold text-sm flex items-center gap-2 transition-colors ml-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
            Share
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar (Slim) */}
        <aside className="w-[72px] bg-white border-r border-border-color flex flex-col items-center py-4 gap-4 overflow-y-auto scrollbar-hide z-10 shadow-sm">
          {[
            { id: 'templates', label: 'Templates', icon: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zm0 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z' },
            { id: 'elements', label: 'Elements', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
            { id: 'text', label: 'Text', icon: 'M3 5h18M9 3v2m6-2v2M4 19h16M12 5v14m-4 0h8' },
            { id: 'brand', label: 'Brand', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
            { id: 'uploads', label: 'Uploads', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
            { id: 'tools', label: 'Tools', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
            { id: 'projects', label: 'Projects', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
            { id: 'apps', label: 'Apps', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
          ].map(item => (
            <button key={item.id} className="flex flex-col items-center gap-1.5 group w-full py-2 hover:bg-gray-50 transition-colors">
              <svg className={`w-6 h-6 text-gray-700 group-hover:text-primary transition-colors ${item.id === 'text' ? 'fill-none stroke-current stroke-2' : 'fill-currentColor'}`} viewBox="0 0 24 24">
                <path d={item.icon} />
              </svg>
              <span className="text-[10px] font-medium text-gray-600 group-hover:text-primary">{item.label}</span>
            </button>
          ))}
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 relative flex flex-col">
          {/* Scrollable Canvas Container */}
          <div className="flex-1 overflow-auto flex flex-col items-center py-10 px-10 relative custom-scrollbar">
            
            {/* Top Toolbar overlay above stage */}
            <div className="flex items-center gap-2 mb-2 w-[500px] justify-end opacity-60 hover:opacity-100 transition-opacity">
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="Lock">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="Duplicate">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/></svg>
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="Delete">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>

            {/* Stage */}
            <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-transform duration-300" style={{ width: '500px', height: '500px' }}>
              <Stage
                width={500}
                height={500}
                onMouseDown={checkDeselect}
                onTouchStart={checkDeselect}
                ref={stageRef}
              >
                <Layer>
                  {elements.map((el) => {
                    if (el.type === 'rect') {
                      return <Rect key={el.id} id={el.id} {...el} onMouseDown={() => selectShape(el.id)} />;
                    }
                    if (el.type === 'circle') {
                      return <Circle key={el.id} id={el.id} {...el} onMouseDown={() => selectShape(el.id)} />;
                    }
                    if (el.type === 'text') {
                      return <Text key={el.id} id={el.id} {...el} onMouseDown={() => selectShape(el.id)} />;
                    }
                    return null;
                  })}
                  {selectedId && (
                    <Transformer
                      ref={trRef}
                      boundBoxFunc={(oldBox, newBox) => (newBox.width < 5 || newBox.height < 5 ? oldBox : newBox)}
                    />
                  )}
                </Layer>
              </Stage>
            </div>

            {/* Add Page Button */}
            <div className="mt-4 w-[500px]">
              <button className="w-full flex items-center justify-center gap-2 py-2 bg-transparent border border-gray-300 rounded hover:bg-gray-200/50 transition-colors text-gray-700 font-semibold text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                Add page
              </button>
            </div>

          </div>

          {/* Bottom Bar */}
          <footer className="h-12 bg-white border-t border-border-color flex items-center justify-between px-4 shrink-0 text-gray-600 text-sm z-10">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 hover:text-gray-900 transition-colors font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                Notes
              </button>
              <button className="flex items-center gap-2 hover:text-gray-900 transition-colors font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Timer
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <input type="range" className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary" />
                <span className="w-10 font-medium">34%</span>
              </div>
              <div className="flex items-center gap-2 ml-4 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Pages 1/1
              </div>
              <button className="p-1 hover:bg-gray-100 rounded ml-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
              </button>
              <button className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center text-xs font-bold hover:bg-gray-100 ml-2">
                ?
              </button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default DesignEditor;
