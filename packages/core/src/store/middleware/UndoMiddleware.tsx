import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { HistoryActions } from '../HistorySlice';
import { CellActions } from '../CellSlice';

export const UndoMiddleware = (store: ToolkitStore) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
  if (action.type === HistoryActions.undo.type) {
    const state = store.getState();
    const currentAction = state.history.actions[state.history.index];
    switch (currentAction?.type) {
      case CellActions.addSticky.type:
        const payload = currentAction.payload as ReturnType<typeof CellActions.addSticky>['payload'];
        store.dispatch(CellActions.deleteCells({ cellIds: [payload.id], historyMate: { ignore: true } }));
        break;
      default:
        break;
    }
  }

  if (action.type === HistoryActions.redo.type) {
    const state = store.getState();
    const currentAction = state.history.actions[state.history.index + 1];
    switch (currentAction?.type) {
      case CellActions.addSticky.type:
        const payload = currentAction.payload as ReturnType<typeof CellActions.addSticky>['payload'];
        store.dispatch(CellActions.addSticky({ ...payload, historyMate: { ignore: true } }));
        break;
      default:
        break;
    }
  }
  const result = next(action);
  if (action.payload?.historyMate?.ignore === undefined) {
    store.dispatch(HistoryActions.recordAction({ ...action, historyMate: { ignore: true } }));
  }

  return result;
};
