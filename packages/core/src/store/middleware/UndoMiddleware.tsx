import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { HistoryActions } from '../HistorySlice';
import { CellActions } from '../CellSlice';
import { CellData } from '../type/Cell';
import { RootState } from '..';
import { AddStickyCommand } from '../command/AddStickyCommand';

export const UndoMiddleware = (store: ToolkitStore) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
  if (action.type === HistoryActions.undo.type) {
    const state = store.getState() as RootState;
    const currentAction = state.history.actions[state.history.index];

    switch (currentAction?.action?.type) {
      case CellActions.addSticky.type: {
        AddStickyCommand.undo(store, currentAction);
        break;
      }
      case CellActions.deleteCells.type: {
        let { cellIds } = currentAction.action.payload as ReturnType<typeof CellActions.deleteCells>['payload'];
        cellIds.forEach((id) => {
          const snapshot = currentAction.snapshot[id];
          store.dispatch(CellActions.addSticky({ id, geometry: snapshot.geometry, historyMate: { ignore: true } }));
        });
        break;
      }
      case CellActions.moveCell.type: {
        let { id } = currentAction.action.payload as ReturnType<typeof CellActions.moveCell>['payload'];
        const snapshot = currentAction.snapshot[id];
        if (snapshot.geometry) {
          store.dispatch(CellActions.moveCell({ id, point: snapshot.geometry, historyMate: { ignore: true } }));
        }
        break;
      }
    }
  }

  if (action.type === HistoryActions.redo.type) {
    const state = store.getState();
    const currentAction = state.history.actions[state.history.index + 1];
    switch (currentAction?.action?.type) {
      case CellActions.addSticky.type: {
        AddStickyCommand.redo(store, currentAction);
        break;
      }
      case CellActions.deleteCells.type: {
        const { cellIds } = currentAction.action?.payload as ReturnType<typeof CellActions.deleteCells>['payload'];
        store.dispatch(CellActions.deleteCells({ cellIds, historyMate: { ignore: true } }));
        break;
      }
      case CellActions.moveCell.type: {
        let { id, point } = currentAction.action.payload as ReturnType<typeof CellActions.moveCell>['payload'];
        store.dispatch(CellActions.moveCell({ id, point, historyMate: { ignore: true } }));
        break;
      }
    }
  }

  if (action.payload?.historyMate?.ignore === undefined) {
    let snapshot: Record<string, CellData> = {};
    if ([CellActions.deleteCells.type, CellActions.moveCell.type].includes(action.type)) {
      snapshot = store.getState().cell.map;
    }
    store.dispatch(HistoryActions.recordAction({ action, snapshot, historyMate: { ignore: true } }));
  }

  const result = next(action);

  return result;
};
