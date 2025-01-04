import { CanvasEvents, TPointerEventInfo } from "fabric";
import { TPointerEvent } from "fabric";
import { Plugin } from "../../base/types";
import { Render } from "../../render";
import { TEventCallback } from "node_modules/fabric/dist/src/Observable";
import { createContextMenuContainer } from "./render";
import { Props } from "./types";
export class ContextMenu extends Plugin {
  public __name__ = 'ContextMenu';
  private _destroyContainer: () => void = () => {};
  private events: Partial<Record<keyof CanvasEvents, Array<TEventCallback<TPointerEventInfo<TPointerEvent>>>>> = {};
  constructor(_render: Render, private Component: React.ComponentType<Props>) {
    super(_render);
    this.events = {
      'mouse:down': [this._handleMouseDown],
      'contextmenu': [this._handleContextMenu],
    };
    this.bindEvents();
  }
  private bindEvents = () => {
    Object.entries(this.events).forEach(([event, handlers]) => {
        handlers.forEach(handler => {
        this._render._FC.on(event as keyof CanvasEvents, handler);
      });
    });
  }
  public __destroy__ = () => {
    Object.entries(this.events).forEach(([event, handlers]) => {
        handlers.forEach(handler => {
        this._render._FC.off(event as keyof CanvasEvents, handler);
      });
    });
  }

  private _handleMouseDown = (_event: TPointerEventInfo<TPointerEvent>) => {
    this._destroyContainer?.();
  }

  private _handleContextMenu = (event: TPointerEventInfo<TPointerEvent>) => {
    event.e.preventDefault();
    this._destroyContainer?.();
    if (event.target) {
      const position = {
        x: (event.e as MouseEvent).clientX,
        y: (event.e as MouseEvent).clientY
      };
      console.log(position);
      this._destroyContainer = createContextMenuContainer(this.Component, {
        target: event.target,
        canvas: this._render._FC,
        destroy: () => {
          this._destroyContainer?.();
        }
      }, {
        x: position.x,
        y: position.y,
      });
    }
  }
}
