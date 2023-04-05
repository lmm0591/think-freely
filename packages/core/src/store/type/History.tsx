import { AnyAction } from '@reduxjs/toolkit';
import { CellData } from './Cell';

export type HistoryMeta = {
  historyMate?: {
    ignore: boolean;
  };
};

export type HistoryAction = {
  action: AnyAction;
  snapshot: Record<string, CellData>;
};
