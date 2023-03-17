import { configureStore } from '@reduxjs/toolkit';
import { CellReduce } from './CellSlice';

export const store = configureStore({
  reducer: {
    cell: CellReduce,
  },
});

export type RootState = ReturnType<typeof store.getState>;
