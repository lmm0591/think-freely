import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { HistoryActions } from '../HistorySlice';
import { CellActions } from '../CellSlice';

export const UndoMiddleware = (store: ToolkitStore) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
  const result = next(action);
  if (action.payload?.mate?.history === undefined) {
    store.dispatch(HistoryActions.recordAction({ ...action, mate: { history: true } }));
  }

  if (action.type === HistoryActions.undo.type) {
    const state = store.getState();
    const lastAction = state.history.actions[state.history.actions.length - 1];
    switch (lastAction?.type) {
      case CellActions.addSticky.type:
        const payload = lastAction.payload as ReturnType<typeof CellActions.addSticky>['payload'];
        store.dispatch(CellActions.deleteCells({ cellIds: [payload.id], historyMate: { history: true } }));
        break;
      default:
        break;
    }
  }
  return result;
};
