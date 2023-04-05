import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { HistoryActions } from '../HistorySlice';
import { CellActions } from '../CellSlice';
import { CellData } from '../type/Cell';
import { RootState } from '..';

export const UndoMiddleware = (store: ToolkitStore) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
  if (action.type === HistoryActions.undo.type) {
    const state = store.getState() as RootState;
    const currentAction = state.history.actions[state.history.index];

    switch (currentAction?.action?.type) {
      case CellActions.addSticky.type:
        const { id } = currentAction.action.payload as ReturnType<typeof CellActions.addSticky>['payload'];
        store.dispatch(CellActions.deleteCells({ cellIds: [id], historyMate: { ignore: true } }));
        break;
      case CellActions.deleteCells.type:
        let { cellIds } = currentAction.action.payload as ReturnType<typeof CellActions.deleteCells>['payload'];
        cellIds.forEach((id) => {
          const snapshot = currentAction.snapshot[id];
          store.dispatch(CellActions.addSticky({ id, geometry: snapshot.geometry, historyMate: { ignore: true } }));
        });
        break;
    }
  }

  if (action.type === HistoryActions.redo.type) {
    const state = store.getState();
    const currentAction = state.history.actions[state.history.index + 1];
    switch (currentAction?.action?.type) {
      case CellActions.addSticky.type:
        const payload = currentAction.action?.payload as ReturnType<typeof CellActions.addSticky>['payload'];
        store.dispatch(CellActions.addSticky({ ...payload, historyMate: { ignore: true } }));
        break;
      case CellActions.deleteCells.type:
        const { cellIds } = currentAction.action?.payload as ReturnType<typeof CellActions.deleteCells>['payload'];
        store.dispatch(CellActions.deleteCells({ cellIds, historyMate: { ignore: true } }));
        break;
    }
  }

  if (action.payload?.historyMate?.ignore === undefined) {
    let snapshot: Record<string, CellData> = {};
    switch (action.type) {
      case CellActions.deleteCells.type:
        const { cellIds } = action.payload as ReturnType<typeof CellActions.deleteCells>['payload'];
        cellIds.map((id) => {
          snapshot[id] = store.getState().cell.map[id];
        });
        break;
    }
    store.dispatch(HistoryActions.recordAction({ action, snapshot, historyMate: { ignore: true } }));
  }

  const result = next(action);

  return result;
};
