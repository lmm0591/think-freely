import { AnyAction } from '@reduxjs/toolkit';
import { CellData } from './Cell';

export type RecordStage = 'before' | 'after';

export type HistoryMeta = {
  historyMate?: {
    ignore: boolean;
    recordStage?: RecordStage;
  };
};

export type HistoryAction = {
  id: string;
  action: AnyAction;
  afterSnapshot: Record<string, CellData>;
  beforeSnapshot: Record<string, CellData>;
};
