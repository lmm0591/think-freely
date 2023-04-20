import { Draft } from '@reduxjs/toolkit';
import { CellState } from '../CellSlice';
import { HistoryAction } from '../type/History';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';

export type Command = {
  undo(store: ToolkitStore, action: HistoryAction, preAction: HistoryAction): void;
  redo(store: ToolkitStore, action: HistoryAction, preAction: HistoryAction): void;
  execute(state: Draft<CellState>, payload: any): void;
};
