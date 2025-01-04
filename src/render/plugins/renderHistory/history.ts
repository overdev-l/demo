import { Operation } from './operation';
import { HistoryConfig } from './types';

export class History {
  public redoStack: Operation[][] = [];
  public undoStack: Operation[][] = [];
  private _isContinue = false;

  constructor(private config: HistoryConfig) {}

  public add(operations: Operation | Operation[]) {
    if (this._isContinue) return;
    this.redoStack = [];
    if (!Array.isArray(operations)) {
      operations = [operations];
    }
    this.undoStack.push(operations);
    if (this.undoStack.length > this.config.max) {
      this.undoStack.shift();
    }
  }

  public async undo() {
    if (!this.undoStack.length) {
      return;
    }
    this._isContinue = true;
    const operations = this.undoStack.pop()!;
    await Promise.all(operations.map((operation) => operation.undo()));
    this.redoStack.push(operations);
    this._isContinue = false;
  }

  public async redo() {
    if (!this.redoStack.length) {
      return;
    }
    this._isContinue = true;
    const operations = this.redoStack.pop()!;
    await Promise.all(operations.map((operation) => operation.redo()));
    this.undoStack.push(operations);
    this._isContinue = false;
  }

  public clear() {
    this.redoStack.length = 0;
    this.undoStack.length = 0;
  }
}
