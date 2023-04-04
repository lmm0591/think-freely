import { configureStore } from '@reduxjs/toolkit';
import { CellReduce } from './CellSlice';
import { HistoryReduce } from './HistorySlice';
import { UndoMiddleware } from './middleware/UndoMiddleware';

export const CreateStore = () => {
  return configureStore({
    reducer: {
      cell: CellReduce,
      history: HistoryReduce,
    },
    middleware: [UndoMiddleware as any],
  });
};
