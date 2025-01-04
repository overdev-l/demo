import { Render } from '@/render/render';
import { Delta, DeltaType } from './types';
import { classRegistry, FabricObject, SerializedObjectProps } from 'fabric';

export class Operation<Type extends DeltaType = DeltaType> {
  constructor(private options: Delta<Type>, public render: Render) {}

  public async undo() {
    const { type } = this.options;
    switch (type) {
      case DeltaType.INSERT: {
        if (this.options.afterData) {
          this.removeById(this.options.afterData);
        }
        return;
      }
      case DeltaType.DELETE: {
        if (this.options.preData) {
          await this.addTarget(this.options.preData);
        }
        return;
      }
      case DeltaType.MODIFY: {
        if (this.options.preData) {
          await this.modifyTarget(this.options.preData);
        }
        return;
      }
      case DeltaType.GROUP: {
        return;
      }
      case DeltaType.UNGROUP: {
        return;
      }
      case DeltaType.Handler: {
        if (this.options.undoHandler) {
          this.options.undoHandler();
        }
        return;
      }
    }
  }

  public async redo() {
    const { type } = this.options;
    switch (type) {
      case DeltaType.INSERT: {
        if (this.options.afterData) {
          await this.addTarget(this.options.afterData);
        }
        return;
      }
      case DeltaType.DELETE: {
        if (this.options.preData) {
          this.removeById(this.options.preData);
        }
        return;
      }
      case DeltaType.MODIFY: {
        if (this.options.afterData) {
          await this.modifyTarget(this.options.afterData);
        }
        return;
      }
      case DeltaType.Handler: {
        if (this.options.redoHandler) {
          this.options.redoHandler();
        }
        return;
      }
    }
  }

  private fabricInstance = async (object: SerializedObjectProps) => {
    return (await (
      classRegistry.getClass(object.type) as typeof FabricObject
    ).fromObject(object)) as FabricObject;
  };

  private removeById = (objects: SerializedObjectProps[]) => {
    const targets = this.render._FC._objects.filter((instance) =>
      objects.find((object) => object._id_ == instance._id_)
    );
    if (!targets) return;
    this.render._FC.remove(...targets);
  };

  private addTarget = async (objects: SerializedObjectProps[]) => {
    const promises = objects.map(async (object) => {
      const instance = await this.fabricInstance(object);
      object._parent_.add(instance);
    });
    await Promise.all(promises);
  };

  private modifyTarget = async (objects: SerializedObjectProps[]) => {
    const promises = objects.map(async (object) => {
      const instance = await this.fabricInstance(object);
      this.removeById([object]);
      object._parent_.add(instance);
    });
    await Promise.all(promises);
  };
}
