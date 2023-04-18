import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { HistoryActions } from '../HistorySlice';
import { CellActions } from '../CellSlice';
import { CellData } from '../type/Cell';
import { MoveCellCommand, AddStickyCommand, DeleteCellsCommand } from '../command';
import { RootState } from '..';

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
        DeleteCellsCommand.undo(store, currentAction);
        break;
      }
      case CellActions.moveCell.type: {
        MoveCellCommand.undo(store, currentAction);
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
        DeleteCellsCommand.redo(store, currentAction);
        break;
      }
      case CellActions.moveCell.type: {
        MoveCellCommand.redo(store, currentAction);
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
