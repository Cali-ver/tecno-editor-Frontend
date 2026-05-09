import React, { useState } from 'react';
import { fabric } from 'fabric';
import useEditorStore from '../../store/useEditorStore';

const ElementsPanel = () => {
  const [activeTab, setActiveTab] = useState('shapes');
  const { fabricCanvas, saveSnapshot } = useEditorStore();

  const handleAddObject = (obj) => {
    if (!fabricCanvas) return;

    const center = fabricCanvas.getCenter();
    obj.set({
      left: center.left,
      top: center.top,
      originX: 'center',
      originY: 'center',
      padding: 10,
    });

    fabricCanvas.add(obj);
    fabricCanvas.setActiveObject(obj);
    fabricCanvas.renderAll();
    saveSnapshot();
  };

  const tabs = [
    { id: 'shapes', label: 'Shapes' },
    { id: 'lines', label: 'Lines' },
    { id: 'frames', label: 'Frames' },
  ];

  const shapes = [
    {
      name: 'Rectangle',
      preview: <div className="w-10 h-8 bg-indigo-500 rounded-sm"></div>,
      create: () => new fabric.Rect({ width: 150, height: 100, fill: '#6366f1', rx: 4, ry: 4 })
    },
    {
      name: 'Circle',
      preview: <div className="w-10 h-10 bg-rose-500 rounded-full"></div>,
      create: () => new fabric.Circle({ radius: 70, fill: '#f43f5e' })
    },
    {
      name: 'Triangle',
      preview: <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[31px] border-b-emerald-500"></div>,
      create: () => new fabric.Triangle({ width: 140, height: 120, fill: '#10b981' })
    },
    {
      name: 'Star',
      preview: (
        <svg width="32" height="32" viewBox="0 0 51 48">
          <polygon fill="#f59e0b" points="25,1 32,18 51,18 36,29 41,47 25,36 9,47 14,29 0,18 19,18" />
        </svg>
      ),
      create: () => new fabric.Polygon([
        { x: 25, y: 0 }, { x: 32, y: 18 }, { x: 51, y: 18 },
        { x: 36, y: 29 }, { x: 41, y: 47 }, { x: 25, y: 36 },
        { x: 9, y: 47 }, { x: 14, y: 29 }, { x: 0, y: 18 }, { x: 19, y: 18 }
      ], { fill: '#f59e0b' })
    },
    {
      name: 'Arrow',
      preview: (
        <svg width="36" height="24" viewBox="0 0 150 130">
          <path fill="#3b82f6" d="M 0 50 L 100 50 L 100 20 L 150 75 L 100 130 L 100 100 L 0 100 z" />
        </svg>
      ),
      create: () => new fabric.Path("M 0 50 L 100 50 L 100 20 L 150 75 L 100 130 L 100 100 L 0 100 z", { fill: '#3b82f6' })
    },
    {
      name: 'Rounded Rect',
      preview: <div className="w-10 h-8 bg-violet-500 rounded-xl"></div>,
      create: () => new fabric.Rect({ width: 150, height: 100, rx: 20, ry: 20, fill: '#8b5cf6' })
    },
    {
      name: 'Line',
      preview: <div className="w-10 h-1 bg-gray-800"></div>,
      create: () => new fabric.Line([-100, 0, 100, 0], { stroke: '#111', strokeWidth: 3 })
    },
    {
      name: 'Hexagon',
      preview: (
        <svg width="32" height="32" viewBox="0 0 100 100">
          <polygon fill="#06b6d4" points="50,0 100,25 100,75 50,100 0,75 0,25" />
        </svg>
      ),
      create: () => new fabric.Polygon([
        { x: 50, y: 0 }, { x: 100, y: 25 }, { x: 100, y: 75 },
        { x: 50, y: 100 }, { x: 0, y: 75 }, { x: 0, y: 25 }
      ], { fill: '#06b6d4' })
    }
  ];

  const lines = [
    {
      name: 'Straight line',
      preview: <div className="w-14 h-[2px] bg-gray-800"></div>,
      create: () => new fabric.Line([-100, 0, 100, 0], { stroke: '#111', strokeWidth: 2 })
    },
    {
      name: 'Thick line',
      preview: <div className="w-14 h-[6px] bg-gray-800 rounded-full"></div>,
      create: () => new fabric.Line([-100, 0, 100, 0], { stroke: '#111', strokeWidth: 6, strokeLineCap: 'round' })
    },
    {
      name: 'Dashed line',
      preview: <div className="w-14 h-[2px] border-b-2 border-dashed border-gray-800"></div>,
      create: () => new fabric.Line([-100, 0, 100, 0], { stroke: '#111', strokeWidth: 2, strokeDashArray: [10, 5] })
    },
    {
      name: 'Dotted line',
      preview: <div className="w-14 h-[2px] border-b-2 border-dotted border-gray-800"></div>,
      create: () => new fabric.Line([-100, 0, 100, 0], { stroke: '#111', strokeWidth: 2, strokeDashArray: [2, 6] })
    },
    {
      name: 'Double line',
      preview: <div className="w-14 h-2 border-y-2 border-gray-800"></div>,
      create: () => {
        const l1 = new fabric.Line([-100, -5, 100, -5], { stroke: '#111', strokeWidth: 2 });
        const l2 = new fabric.Line([-100, 5, 100, 5], { stroke: '#111', strokeWidth: 2 });
        return new fabric.Group([l1, l2]);
      }
    },
    {
      name: 'Arrow line',
      preview: (
        <svg width="56" height="12" viewBox="0 0 56 12">
          <line x1="0" y1="6" x2="50" y2="6" stroke="#1f2937" strokeWidth="2" />
          <polygon points="50,1 56,6 50,11" fill="#1f2937" />
        </svg>
      ),
      create: () => {
        const line = new fabric.Line([-100, 0, 100, 0], { stroke: '#111', strokeWidth: 2 });
        const triangle = new fabric.Triangle({
          width: 15, height: 15, fill: '#111', left: 100, top: 0, originX: 'center', originY: 'center', angle: 90
        });
        return new fabric.Group([line, triangle]);
      }
    }
  ];

  const frames = [
    {
      name: 'Rectangle frame',
      preview: <div className="w-10 h-10 border-2 border-gray-300 bg-gray-50 rounded-sm"></div>,
      create: () => {
        const rect = new fabric.Rect({ width: 150, height: 150, fill: 'transparent', stroke: '#ccc', strokeWidth: 2 });
        rect.set('isFrame', true);
        return rect;
      }
    },
    {
      name: 'Circle frame',
      preview: <div className="w-10 h-10 border-2 border-gray-300 bg-gray-50 rounded-full"></div>,
      create: () => {
        const circle = new fabric.Circle({ radius: 75, fill: 'transparent', stroke: '#ccc', strokeWidth: 2 });
        circle.set('isFrame', true);
        return circle;
      }
    },
    {
      name: 'Rounded frame',
      preview: <div className="w-10 h-10 border-2 border-gray-300 bg-gray-50 rounded-2xl"></div>,
      create: () => {
        const rounded = new fabric.Rect({ width: 150, height: 150, rx: 20, ry: 20, fill: 'transparent', stroke: '#ccc', strokeWidth: 2 });
        rounded.set('isFrame', true);
        return rounded;
      }
    },
    {
      name: 'Triangle frame',
      preview: (
        <svg width="40" height="40" viewBox="0 0 40 40">
          <polygon points="20,5 35,35 5,35" fill="#f9fafb" stroke="#d1d5db" strokeWidth="2" />
        </svg>
      ),
      create: () => {
        const tri = new fabric.Triangle({ width: 150, height: 130, fill: 'transparent', stroke: '#ccc', strokeWidth: 2 });
        tri.set('isFrame', true);
        return tri;
      }
    }
  ];

  const renderGrid = (items) => (
    <div className="grid grid-cols-2 gap-3 p-4 overflow-y-auto custom-scrollbar h-full pb-20">
      {items.map((item, idx) => (
        <button
          key={idx}
          onClick={() => handleAddObject(item.create())}
          className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-md transition-all group gap-3 aspect-square"
        >
          <div className="flex-1 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            {item.preview}
          </div>
          <span className="text-xs font-semibold text-gray-600 group-hover:text-purple-600">
            {item.name}
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      <div className="px-4 pt-4 pb-2 bg-white border-b border-gray-200 shrink-0">
        <h3 className="font-bold text-gray-900 mb-4">Elements</h3>
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === tab.id 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'shapes' && renderGrid(shapes)}
        {activeTab === 'lines' && renderGrid(lines)}
        {activeTab === 'frames' && renderGrid(frames)}
      </div>
    </div>
  );
};

export default ElementsPanel;
