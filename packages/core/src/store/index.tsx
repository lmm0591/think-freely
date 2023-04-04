import { configureStore } from '@reduxjs/toolkit';
import { CellReduce } from './CellSlice';
import { HistoryReduce } from './HistorySlice';
import { UndoMiddleware } from './middleware/UndoMiddleware';

export const store = configureStore({
  reducer: {
    history: HistoryReduce,
    cell: CellReduce,
  },
  middleware: [UndoMiddleware],
});

export type RootState = ReturnType<typeof store.getState>;
