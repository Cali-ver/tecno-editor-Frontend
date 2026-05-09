import { create } from 'zustand';

const useEditorStore = create((set, get) => ({
  // --- STATE ---
  fabricCanvas: null,
  activePanel: 'elements',
  selectedObject: null,
  history: [],
  historyIndex: -1,
  zoom: 1,
  isSaved: true,
  designId: null,
  designTitle: 'Untitled Design',
  accessLevel: 'ONLY_YOU',
  ownerEmail: null,
  isPublic: false,

  // --- ACTIONS ---
  setFabricCanvas: (canvas) => set({ fabricCanvas: canvas }),

  setActivePanel: (panel) => set({ activePanel: panel }),

  setSelectedObject: (obj) => set({ selectedObject: obj }),

  saveSnapshot: () => {
    const { fabricCanvas, history, historyIndex } = get();
    if (!fabricCanvas) return;

    const snapshot = fabricCanvas.toJSON();
    // Remove any future history if we are currently undoing and then save a new snapshot
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(snapshot);

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
      isSaved: false,
    });
  },

  undo: () => {
    const { fabricCanvas, history, historyIndex } = get();
    if (!fabricCanvas || historyIndex <= 0) return;

    const newIndex = historyIndex - 1;
    fabricCanvas.loadFromJSON(history[newIndex], () => {
      fabricCanvas.renderAll();
      set({ historyIndex: newIndex, isSaved: false });
    });
  },

  redo: () => {
    const { fabricCanvas, history, historyIndex } = get();
    if (!fabricCanvas || historyIndex >= history.length - 1) return;

    const newIndex = historyIndex + 1;
    fabricCanvas.loadFromJSON(history[newIndex], () => {
      fabricCanvas.renderAll();
      set({ historyIndex: newIndex, isSaved: false });
    });
  },

  setZoom: (level) => {
    const { fabricCanvas } = get();
    if (fabricCanvas) {
      fabricCanvas.setZoom(level);
      // Optional: if zooming to center is needed, you might adjust logic here later
      fabricCanvas.renderAll();
    }
    set({ zoom: level });
  },

  markSaved: () => set({ isSaved: true }),

  setDesign: (id, title, accessLevel, ownerEmail, isPublic) => set({ 
    designId: id, 
    designTitle: title, 
    accessLevel: accessLevel || 'ONLY_YOU',
    ownerEmail: ownerEmail || null,
    isPublic: isPublic || false
  }),

  resetEditor: () => set({
    fabricCanvas: null,
    activePanel: 'elements',
    selectedObject: null,
    history: [],
    historyIndex: -1,
    zoom: 1,
    isSaved: true,
    designId: null,
    designTitle: 'Untitled Design',
    accessLevel: 'ONLY_YOU',
    ownerEmail: null,
    isPublic: false,
  }),
}));

export default useEditorStore;
