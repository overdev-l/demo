import { SerializedObjectProps } from 'fabric';

export interface HistoryConfig {
  max: number;
}
export enum DeltaType {
  INSERT = 'insert',
  DELETE = 'delete',
  MODIFY = 'modify',
  GROUP = 'group',
  UNGROUP = 'ungroup',
  Handler = 'handler',
}

type DataType<T extends DeltaType> = T extends DeltaType.INSERT
  ? SerializedObjectProps[]
  : T extends DeltaType.DELETE
  ? SerializedObjectProps[]
  : T extends DeltaType.MODIFY
  ? SerializedObjectProps[]
  : never;

export interface Delta<T extends DeltaType, U = DataType<T>> {
  type: T;
  afterData: U | null;
  preData: U | null;
  undoHandler: T extends DeltaType.Handler ? () => void : undefined;
  redoHandler: T extends DeltaType.Handler ? () => void : undefined;
}
