import { AnyAction, PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { HistoryAction, HistoryMeta } from './type/History';
import { CellData } from './type/Cell';

export interface HistoryState {
  actions: HistoryAction[];
  index: number;
}

export const initialState: HistoryState = {
  actions: [],
  index: -1,
};

export const HistorySlice = createSlice({
  name: 'History',
  initialState,
  reducers: {
    recordAction: (
      state,
      { payload }: PayloadAction<{ id: string; action: AnyAction; snapshot: Record<string, CellData> } & HistoryMeta>,
    ) => {
      if (payload.historyMate?.recordStage === 'before') {
        state.actions.push({
          id: payload.id,
          action: payload.action,
          snapshot: payload.snapshot,
          beforeSnapshot: payload.snapshot,
          afterSnapshot: {},
        });
      } else if (payload.historyMate?.recordStage === 'after') {
        const existAction = state.actions.find((action) => action.id === payload.id);
        if (existAction) {
          existAction.afterSnapshot = payload.snapshot;
        }
        ++state.index;
      }
    },
    undo: (state, {}: PayloadAction<HistoryMeta>) => {
      if (state.index <= -1) {
        return;
      }
      --state.index;
    },
    redo: (state, {}: PayloadAction<HistoryMeta>) => {
      if (state.index >= state.actions.length - 1) {
        return;
      }
      ++state.index;
    },
  },
});

export const HistoryActions = HistorySlice.actions;
export const HistoryReduce = HistorySlice.reducer;
