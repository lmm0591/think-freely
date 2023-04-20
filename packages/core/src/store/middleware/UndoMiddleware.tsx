import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { v4 } from 'uuid';
import { HistoryActions } from '../HistorySlice';
import { CellData } from '../type/Cell';
import { commandManager } from '../command/CommandManager';
import { RootState } from '..';
import { RecordStage } from '../type/History';

function recordAction(store: ToolkitStore, historyId: string, action: AnyAction, recordStage: RecordStage) {
  let snapshot: Record<string, CellData> = store.getState().cell.map;
  store.dispatch(
    HistoryActions.recordAction({
      id: historyId,
      action,
      snapshot,
      historyMate: { ignore: true, recordStage },
    }),
  );
}

export const UndoMiddleware = (store: ToolkitStore) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
  const state = store.getState() as RootState;
  if (action.type === HistoryActions.undo.type) {
    const currentAction = state.history.actions[state.history.index];
    const preAction = state.history.actions[state.history.index - 1];
    commandManager.commands[currentAction?.action?.type]?.undo(store, currentAction, preAction);
  } else if (action.type === HistoryActions.redo.type) {
    const currentAction = state.history.actions[state.history.index + 1];
    const preAction = state.history.actions[state.history.index];
    commandManager.commands[currentAction?.action?.type]?.redo(store, currentAction, preAction);
  }

  const historyId = v4();
  if (action.payload?.historyMate?.ignore === undefined) {
    recordAction(store, historyId, action, 'before');
  }

  const result = next(action);

  if (action.payload?.historyMate?.ignore === undefined) {
    recordAction(store, historyId, action, 'after');
  }

  return result;
};
