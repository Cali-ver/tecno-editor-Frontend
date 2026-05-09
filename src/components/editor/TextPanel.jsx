import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import useEditorStore from '../../store/useEditorStore';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, Search } from 'lucide-react';

const FONTS = [
  'Georgia', 'Playfair Display', 'Merriweather', 'Lato', 'Montserrat',
  'Raleway', 'Oswald', 'Nunito', 'Poppins', 'Ubuntu', 'Roboto Slab',
  'Dancing Script', 'Pacifico', 'Lobster', 'Bebas Neue', 'Anton',
  'Abril Fatface', 'Permanent Marker', 'Comfortaa', 'Righteous'
];

const TextPanel = () => {
  const { fabricCanvas, saveSnapshot } = useEditorStore();
  const [activeTextObj, setActiveTextObj] = useState(null);
  const [, setUpdateTrigger] = useState(false);
  const [searchFont, setSearchFont] = useState('');

  // Track active text object on canvas
  useEffect(() => {
    if (!fabricCanvas) return;

    const updateActiveText = () => {
      const activeObj = fabricCanvas.getActiveObject();
      if (activeObj && (activeObj.type === 'text' || activeObj.type === 'i-text' || activeObj.type === 'textbox')) {
        setActiveTextObj(activeObj);
      } else {
        setActiveTextObj(null);
      }
      setUpdateTrigger(prev => !prev); // Force re-render for properties panel
    };

    fabricCanvas.on('selection:created', updateActiveText);
    fabricCanvas.on('selection:updated', updateActiveText);
    fabricCanvas.on('selection:cleared', updateActiveText);
    fabricCanvas.on('object:modified', updateActiveText);

    updateActiveText(); // Initial check

    return () => {
      fabricCanvas.off('selection:created', updateActiveText);
      fabricCanvas.off('selection:updated', updateActiveText);
      fabricCanvas.off('selection:cleared', updateActiveText);
      fabricCanvas.off('object:modified', updateActiveText);
    };
  }, [fabricCanvas]);

  const handleAddText = (text, options) => {
    if (!fabricCanvas) return;
    const center = fabricCanvas.getCenter();
    const t = new fabric.IText(text, {
      left: center.left,
      top: center.top,
      originX: 'center',
      originY: 'center',
      padding: 10,
      ...options
    });
    fabricCanvas.add(t);
    fabricCanvas.setActiveObject(t);
    fabricCanvas.renderAll();
    saveSnapshot();
  };

  const handleAddGroup = (group) => {
    if (!fabricCanvas) return;
    const center = fabricCanvas.getCenter();
    group.set({
      left: center.left,
      top: center.top,
      originX: 'center',
      originY: 'center'
    });
    fabricCanvas.add(group);
    fabricCanvas.setActiveObject(group);
    fabricCanvas.renderAll();
    saveSnapshot();
  };

  const updateTextProp = (prop, value) => {
    if (!activeTextObj) return;
    activeTextObj.set(prop, value);
    fabricCanvas.renderAll();
    setUpdateTrigger(prev => !prev);
    saveSnapshot();
  };

  const toggleTextProp = (prop, valueOn, valueOff) => {
    if (!activeTextObj) return;
    const currentValue = activeTextObj.get(prop);
    activeTextObj.set(prop, currentValue === valueOn ? valueOff : valueOn);
    fabricCanvas.renderAll();
    setUpdateTrigger(prev => !prev);
    saveSnapshot();
  };

  const handleFontSelect = (font) => {
    if (!activeTextObj) return;

    // Load font dynamically via Google Fonts if it's not Georgia
    if (font !== 'Georgia') {
      const fontId = `google-font-${font.replace(/\s+/g, '-')}`;
      if (!document.getElementById(fontId)) {
        const link = document.createElement('link');
        link.id = fontId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}&display=swap`;
        document.head.appendChild(link);
      }
    }

    // Give the browser a tiny bit of time to start fetching before applying (though ideally we'd use WebFontLoader)
    setTimeout(() => {
      activeTextObj.set('fontFamily', font);
      fabricCanvas.renderAll();
      setUpdateTrigger(prev => !prev);
      saveSnapshot();
    }, 100);
  };

  const filteredFonts = FONTS.filter(f => f.toLowerCase().includes(searchFont.toLowerCase()));

  // Render text properties panel if text is selected
  if (activeTextObj) {
    return (
      <div className="w-full h-full flex flex-col bg-gray-50 overflow-y-auto custom-scrollbar p-4">
        <h3 className="font-bold text-gray-900 mb-6">Text Properties</h3>

        <div className="space-y-6">
          {/* Font Family Picker */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Font Family</label>
            <div className="relative mb-2">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search fonts..."
                value={searchFont}
                onChange={(e) => setSearchFont(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div className="h-40 overflow-y-auto border border-gray-200 rounded-md bg-white custom-scrollbar">
              {filteredFonts.map(font => {
                // Ensure previews load font if possible by injecting quick inline styles
                const fontUrl = font !== 'Georgia' ? `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}&display=swap` : '';
                return (
                  <button
                    key={font}
                    onClick={() => handleFontSelect(font)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-purple-50 transition-colors ${activeTextObj.get('fontFamily') === font ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-700'}`}
                    style={{ fontFamily: font }}
                  >
                    {font !== 'Georgia' && <style>{`@import url('${fontUrl}');`}</style>}
                    {font}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size & Color */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Font Size</label>
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white">
                <button onClick={() => updateTextProp('fontSize', Math.max(1, (activeTextObj.get('fontSize') || 16) - 1))} className="px-3 py-1.5 hover:bg-gray-100 border-r border-gray-200">-</button>
                <input
                  type="number"
                  value={Math.round(activeTextObj.get('fontSize') || 16)}
                  onChange={(e) => updateTextProp('fontSize', parseInt(e.target.value) || 16)}
                  className="w-full text-center py-1.5 text-sm outline-none"
                />
                <button onClick={() => updateTextProp('fontSize', (activeTextObj.get('fontSize') || 16) + 1)} className="px-3 py-1.5 hover:bg-gray-100 border-l border-gray-200">+</button>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Color</label>
              <div className="w-full h-9 border border-gray-300 rounded-md overflow-hidden relative cursor-pointer">
                <input
                  type="color"
                  value={activeTextObj.get('fill') || '#000000'}
                  onChange={(e) => updateTextProp('fill', e.target.value)}
                  className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Formatting */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Formatting</label>
            <div className="flex gap-1 border border-gray-200 p-1 rounded-md bg-white">
              <button
                onClick={() => toggleTextProp('fontWeight', 'bold', 'normal')}
                className={`flex-1 flex justify-center py-1.5 rounded-sm transition-colors ${activeTextObj.get('fontWeight') === 'bold' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleTextProp('fontStyle', 'italic', 'normal')}
                className={`flex-1 flex justify-center py-1.5 rounded-sm transition-colors ${activeTextObj.get('fontStyle') === 'italic' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleTextProp('underline', true, false)}
                className={`flex-1 flex justify-center py-1.5 rounded-sm transition-colors ${activeTextObj.get('underline') ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Underline className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Alignment */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Alignment</label>
            <div className="flex gap-1 border border-gray-200 p-1 rounded-md bg-white">
              {['left', 'center', 'right', 'justify'].map(align => (
                <button
                  key={align}
                  onClick={() => updateTextProp('textAlign', align)}
                  className={`flex-1 flex justify-center py-1.5 rounded-sm transition-colors ${activeTextObj.get('textAlign') === align ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {align === 'left' && <AlignLeft className="w-4 h-4" />}
                  {align === 'center' && <AlignCenter className="w-4 h-4" />}
                  {align === 'right' && <AlignRight className="w-4 h-4" />}
                  {align === 'justify' && <AlignJustify className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Spacing */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex justify-between">
              <span>Letter Spacing</span>
              <span className="text-gray-900">{Math.round((activeTextObj.get('charSpacing') || 0) / 10)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={activeTextObj.get('charSpacing') || 0}
              onChange={(e) => updateTextProp('charSpacing', parseInt(e.target.value))}
              className="w-full accent-purple-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex justify-between">
              <span>Line Height</span>
              <span className="text-gray-900">{activeTextObj.get('lineHeight') || 1}</span>
            </label>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={activeTextObj.get('lineHeight') || 1}
              onChange={(e) => updateTextProp('lineHeight', parseFloat(e.target.value))}
              className="w-full accent-purple-600"
            />
          </div>
        </div>
      </div>
    );
  }

  // Render text presets if no text is selected
  return (
    <div className="w-full h-full flex flex-col bg-gray-50 overflow-y-auto custom-scrollbar p-4">
      <h3 className="font-bold text-gray-900 mb-4">Text</h3>

      <div className="flex flex-col gap-3 mb-8">
        <button
          onClick={() => handleAddText('Add a heading', { fontSize: 48, fontWeight: 'bold', fill: '#111111', fontFamily: 'Georgia' })}
          className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-sm transition-all"
        >
          <span className="text-2xl font-bold text-gray-900 font-serif">Add a heading</span>
        </button>
        <button
          onClick={() => handleAddText('Add a subheading', { fontSize: 28, fontWeight: '600', fill: '#444444', fontFamily: 'Georgia' })}
          className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-sm transition-all"
        >
          <span className="text-lg font-semibold text-gray-800 font-serif">Add a subheading</span>
        </button>
        <button
          onClick={() => handleAddText('Add a little bit of body text', { fontSize: 16, fill: '#666666', fontFamily: 'Georgia' })}
          className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-sm transition-all"
        >
          <span className="text-sm text-gray-600 font-serif">Add a little bit of body text</span>
        </button>
      </div>

      <h4 className="font-bold text-gray-900 mb-4 text-sm">Styled Text</h4>
      <div className="grid grid-cols-2 gap-3 pb-20">
        
        <button
          onClick={() => handleAddText('IMPACT', { fontWeight: 'bold', fill: '#111111', fontSize: 50, fontFamily: 'Arial' })}
          className="h-24 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:border-purple-500 hover:shadow-md transition-all group"
        >
          <span className="font-bold text-2xl text-gray-900 group-hover:scale-105 transition-transform uppercase tracking-wider">Impact</span>
        </button>

        <button
          onClick={() => handleAddText('Elegant', { fontStyle: 'italic', fill: '#7c3aed', fontSize: 40, fontFamily: 'Georgia' })}
          className="h-24 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:border-purple-500 hover:shadow-md transition-all group"
        >
          <span className="italic text-2xl text-purple-600 font-serif group-hover:scale-105 transition-transform">Elegant</span>
        </button>

        <button
          onClick={() => handleAddText('OUTLINE', { stroke: '#111111', strokeWidth: 2, fill: 'transparent', fontWeight: 'bold', fontSize: 44, fontFamily: 'Arial' })}
          className="h-24 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:border-purple-500 hover:shadow-md transition-all group"
        >
          <span className="font-bold text-2xl text-transparent stroke-current group-hover:scale-105 transition-transform" style={{ WebkitTextStroke: '1.5px #111' }}>OUTLINE</span>
        </button>

        <button
          onClick={() => handleAddText('COLOR', { fill: '#f43f5e', fontWeight: 'bold', fontSize: 42, fontFamily: 'Arial' })}
          className="h-24 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:border-purple-500 hover:shadow-md transition-all group"
        >
          <span className="font-bold text-2xl text-rose-500 group-hover:scale-105 transition-transform">COLOR</span>
        </button>

        <button
          onClick={() => {
            const title = new fabric.IText('TITLE', { fontSize: 36, fontWeight: 'bold', fill: '#111', top: 0, originX: 'center' });
            const sub = new fabric.IText('SUBTITLE', { fontSize: 16, fill: '#666', top: 40, originX: 'center', charSpacing: 200 });
            handleAddGroup(new fabric.Group([title, sub]));
          }}
          className="h-24 bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center hover:border-purple-500 hover:shadow-md transition-all group gap-1"
        >
          <span className="font-bold text-lg text-gray-900 group-hover:scale-105 transition-transform leading-none">TITLE</span>
          <span className="text-[10px] text-gray-500 tracking-widest group-hover:scale-105 transition-transform">SUBTITLE</span>
        </button>

        <button
          onClick={() => {
            const rect = new fabric.Rect({ width: 140, height: 50, fill: '#10b981', rx: 25, ry: 25, originX: 'center', originY: 'center' });
            const text = new fabric.IText('BADGE', { fontSize: 20, fontWeight: 'bold', fill: '#fff', originX: 'center', originY: 'center' });
            handleAddGroup(new fabric.Group([rect, text]));
          }}
          className="h-24 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:border-purple-500 hover:shadow-md transition-all group"
        >
          <div className="bg-emerald-500 text-white px-4 py-1.5 rounded-full font-bold text-sm group-hover:scale-105 transition-transform">
            BADGE
          </div>
        </button>

      </div>
    </div>
  );
};

export default TextPanel;
