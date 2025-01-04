import { Render } from '@/render/render';
import { Plugin } from '../../base/types';
import { CanvasEvents, TPointerEvent, TPointerEventInfo } from 'fabric';
import { DeltaType, HistoryConfig } from './types';
import { History } from './history';
import { Operation } from './operation';
import { propertiesToInclude } from '@/render/base/ownDefaults';
export class HistoryPlugins extends Plugin {
  public __name__ = 'History';
  private history: History;
  constructor(
    render: Render,
    historyConfig: HistoryConfig = {
      max: 9999,
    }
  ) {
    super(render);
    this.history = new History(historyConfig);
    this.bindEvents();
  }

  private bindEvents(): void {
    this.handleEvent(true);
  }

  public __destroy__ = () => {
    this.handleEvent(false);
  };

  public undo() {
    this.history.undo();
  }

  public redo() {
    this.history.redo();
  }

  private handleEvent = (eventSwitch: boolean) => {
    const events = {
      'object:added': [this.handleObjectAdd],
      'object:removed': [this.handleObjectRemove],
      'object:modified': [this.handleObjectModify],
    };

    Object.entries(events).forEach(([event, handlers]) =>
      handlers.forEach((handler) =>
        eventSwitch
          ? this._render._FC.on(event as keyof CanvasEvents, handler)
          : this._render._FC.off(event as keyof CanvasEvents, handler)
      )
    );
  };

  private handleObjectAdd = (e: TPointerEventInfo<TPointerEvent>) => {
    if (!e.target) return;
    if (!e.target._name_) return;
    const operation = new Operation(
      {
        type: DeltaType.INSERT,
        preData: null,
        afterData: [e.target.toObject(propertiesToInclude)],
        undoHandler: undefined,
        redoHandler: undefined,
      },
      this._render
    );
    this.history.add(operation);
  };

  private handleObjectRemove = (e: TPointerEventInfo<TPointerEvent>) => {
    if (!e.target) return;
    if (!e.target._name_) return;
    // 保存对象的原始位置信息
    const objectData = e.target.toObject(propertiesToInclude);
    const operation = new Operation(
      {
        type: DeltaType.DELETE,
        preData: [objectData],
        afterData: null,
        undoHandler: undefined,
        redoHandler: undefined,
      },
      this._render
    );
    this.history.add(operation);
  };

  private handleObjectModify = (e: TPointerEventInfo<TPointerEvent>) => {
    if (!e.target) return;
    if (!e.target._name_) return;
    const objectData = e.target.toObject(propertiesToInclude);
    const operation = new Operation(
      {
        type: DeltaType.MODIFY,
        preData: [
          {
            ...objectData,
            ...e.transform,
            ...e.transform?.original,
          },
        ],
        afterData: [objectData],
        undoHandler: undefined,
        redoHandler: undefined,
      },
      this._render
    );
    this.history.add(operation);
  };
}
