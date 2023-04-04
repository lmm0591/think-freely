import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { HistoryMeta } from './type/History';

export interface HistoryState {
  actions: PayloadAction[];
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
    recordAction: (state, { payload }: PayloadAction<any & HistoryMeta>) => {
      state.actions.push(payload);
      ++state.index;
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
