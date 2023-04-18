import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { HistoryActions } from '../HistorySlice';
import { CellActions } from '../CellSlice';
import { CellData } from '../type/Cell';
import { commandManager } from '../command/CommandManager';
import { RootState } from '..';

export const UndoMiddleware = (store: ToolkitStore) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
  const state = store.getState() as RootState;
  if (action.type === HistoryActions.undo.type) {
    const currentAction = state.history.actions[state.history.index];
    commandManager.commands[currentAction?.action?.type]?.undo(store, currentAction);
  }

  if (action.type === HistoryActions.redo.type) {
    const currentAction = state.history.actions[state.history.index + 1];
    commandManager.commands[currentAction?.action?.type]?.redo(store, currentAction);
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
