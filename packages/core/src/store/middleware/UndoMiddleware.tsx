import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { HistoryActions } from '../HistorySlice';

export const UndoMiddleware = (store: any) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
  const result = next(action);
  if (action.payload?.mate?.history === undefined) {
    store.dispatch(HistoryActions.recordAction({ ...action, mate: { history: true } }));
  }
  return result;
};
