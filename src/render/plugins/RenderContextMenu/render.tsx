import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import { Props } from "./types";
const cssStyle = {
  position: "fixed" as const,
  width: "fit-content",
  height: "fit-content",
  zIndex: 20000,
  left: 0,
  top: 0,
};

export const createContextMenuContainer = (Component: React.ComponentType<Props>, props: Props, position: { x: number, y: number }) => {
  // 动态创建 div
  const div = document.createElement("div");
  const style = Object.assign({}, div.style, cssStyle, {
    left: `${position.x}px`,
    top: `${position.y}px`,
  });
  Object.assign(div.style, style);
  document.body.appendChild(div);
  const portal = createPortal(<Component {...props} />, div);
  const root = createRoot(div);
  root.render(portal);
  return () => {
    root.unmount();
    div.remove();
  };
};
