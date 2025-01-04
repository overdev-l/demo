import {
  Render,
  HotKey,
  MouseAction,
  Selection,
  HistoryPlugins,
  ContextMenu,
} from "@/render";
import { useUiStateStore, useRenderStore } from "@/store";
import { useCallback, useEffect, useState } from "react";
import ContextMenuComponent from "@/components/contextMenu";

export const useRender = (container: string) => {
  const [renderHotKey, setRenderHotKey] = useState<HotKey | null>(null);
  const [renderMouseAction, setRenderMouseAction] =
    useState<MouseAction | null>(null);
  const { setIsCreateFrame, setIsCreateText } = useUiStateStore();
  const {
    setRender,
    render,
    setRenderSelection,
    renderSelection,
    setHistoryPlugins,
    historyPlugins,
    setContextMenu,
    contextMenu,
  } = useRenderStore();

  const addFrame = useCallback(() => {
    setIsCreateFrame(false);
  }, [setIsCreateFrame]);

  const addText = useCallback(() => {
    setIsCreateText(false);
  }, [setIsCreateText]);
  useEffect(() => {
    const render = new Render({
      container: container,
    });
    setRender(render);
    const hotKey = new HotKey(render);
    const mouseAction = new MouseAction(render);
    const selection = new Selection(render);
    const historyPlugins = new HistoryPlugins(render);
    const contextMenuPlugin = new ContextMenu(render, ContextMenuComponent);
    setRenderHotKey(hotKey);
    setRenderMouseAction(mouseAction);
    setRenderSelection(selection);
    setHistoryPlugins(historyPlugins);
    setContextMenu(contextMenuPlugin);
    render.use(hotKey).use(mouseAction).use(selection).use(historyPlugins).use(contextMenuPlugin);
    render.on("frame:create", addFrame);
    render.on("text:create", addText);
    return () => {
      render.unmount();
    };
  }, [container, addFrame, addText, setRender, setRenderSelection, setHistoryPlugins, setContextMenu]);

  return {
    render,
    renderHotKey,
    renderMouseAction,
    renderSelection,
    historyPlugins,
  };
};
