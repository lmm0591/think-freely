import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface HistoryState {
  actions: PayloadAction[];
  index: number;
}

export const initialState: HistoryState = {
  actions: [],
  index: 0,
};

export const HistorySlice = createSlice({
  name: 'History',
  initialState,
  reducers: {
    recordAction: (state, { payload }: PayloadAction<any>) => {
      state.actions.push(payload);
      state.index = state.actions.length;
    },
  },
});

export const HistoryActions = HistorySlice.actions;
export const HistoryReduce = HistorySlice.reducer;
