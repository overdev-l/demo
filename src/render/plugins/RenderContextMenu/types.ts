import { FabricObject, Canvas } from "fabric";

export type Props = {
  target: FabricObject;
  canvas: Canvas;
  destroy: () => void;
};
