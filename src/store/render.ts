import { Render, Selection, HistoryPlugins, ContextMenu } from "@/render";
import { create } from "zustand";

export const useRenderStore = create<{
  render: Render | null;
  setRender: (render: Render) => void;
  renderSelection: Selection | null;
  setRenderSelection: (renderSelection: Selection) => void;
  historyPlugins: HistoryPlugins | null;
  setHistoryPlugins: (historyPlugins: HistoryPlugins) => void;
  contextMenu: ContextMenu | null;
  setContextMenu: (contextMenu: ContextMenu) => void;
}>((set) => ({
  render: null,
  setRender: (render: Render) => set({ render: render }),
  renderSelection: null,
  setRenderSelection: (renderSelection: Selection) =>
    set({ renderSelection: renderSelection }),
  historyPlugins: null,
  setHistoryPlugins: (historyPlugins: HistoryPlugins) =>
    set({ historyPlugins: historyPlugins }),
  contextMenu: null,
  setContextMenu: (contextMenu: ContextMenu) => set({ contextMenu: contextMenu }),
}));
