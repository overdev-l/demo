import {
  TPointerEvent,
  TPointerEventInfo,
  CanvasEvents,
  FabricObject,
  Group, ActiveSelection,
} from 'fabric';
import { Plugin } from '../base/types';
import { Render } from '../render';
import { TEventCallback } from 'node_modules/fabric/dist/src/Observable';
import {
  getVisibleObjects,
  isMouseOverObject,
  sortElementsByZIndex,
} from '../utils/canvas';
import { ElementName } from '../utils';

export class MouseAction extends Plugin {
  public __name__ = 'MouseAction';
  private _events: Record<
    string,
    Array<TEventCallback<TPointerEventInfo<TPointerEvent>>>
  > = {};
  constructor(render: Render) {
    super(render);
    this._events = {
      'object:moving': [this.handleObjectMoving]
    };
    this.bindEvents();
  }

  public __destroy__ = () => {
    Object.entries(this._events).forEach(([event, handlers]) =>
      handlers.forEach((handler) =>
        this._render._FC.off(event as keyof CanvasEvents, handler)
      )
    );
  };

  private bindEvents(): void {
    Object.entries(this._events).forEach(([event, handlers]) =>
      handlers.forEach((handler) =>
        this._render._FC.on(
          event as keyof CanvasEvents,
          handler as TEventCallback<TPointerEventInfo<TPointerEvent>>
        )
      )
    );
  }

  private moveToFrame = (
    elements: FabricObject[],
    targetFrame: Group
  ): void => {
    elements = elements.filter((item) => item._parent_ !== targetFrame);
    elements.forEach((el) => el._parent_?.remove(el));
    targetFrame.add(...elements);
    elements.forEach((el) => el.set('_parent_', targetFrame));
    this._render._FC.requestRenderAll();
  };

  private moveToCanvas = (elements: FabricObject[]): void => {
    elements = elements.filter(
      (item) => item._parent_ !== this._render._FC
    );
    elements.forEach((el) => el._parent_?.remove(el));
    if (elements.length > 1) {
      const activeSelection = new ActiveSelection(elements, { canvas: this._render._FC })
      this._render._FC.setActiveObject(activeSelection);
    } else {
      this._render._FC.add(...elements);
    }
    elements.forEach((el) => el.set('_parent_', this._render._FC));
    this._render._FC.requestRenderAll();
  };

  private handleObjectMoving = (event: TPointerEventInfo<TPointerEvent>): void => {
    const targetEls = this._render._FC.getActiveObjects();
    const elsInView = getVisibleObjects(this._render._FC);
    const frameEls = elsInView.filter((el) => el._name_ === ElementName.FRAME);
    const isOverFrame = frameEls.filter((el) =>
        isMouseOverObject(this._render._FC, event.e, el)
    );
    const sortedEls = sortElementsByZIndex(isOverFrame);
    const frontGroup = sortedEls[0] as Group | undefined;
    if (frontGroup) {
      this.moveToFrame(targetEls, frontGroup);
    } else {
      this.moveToCanvas(targetEls)
    }
  };
}


