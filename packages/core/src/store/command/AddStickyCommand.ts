import { Draft } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { Command } from './Command';
import { CellData, CellStyle } from '../type/Cell';
import { HistoryAction, HistoryMeta } from '../type/History';
import { CellActions, CellState } from '../CellSlice';
import { commandManager } from './CommandManager';

export type AddStickyCommandPayload = Omit<CellData, 'type' | 'children' | 'style'> & { style?: CellStyle } & HistoryMeta;

export const AddStickyCommand: Command = {
  undo: (store: ToolkitStore, currentAction: HistoryAction) => {
    const { id } = currentAction.action.payload as AddStickyCommandPayload;
    store.dispatch(CellActions.deleteCells({ cellIds: [id], historyMate: { ignore: true } }));
  },
  redo: (store: ToolkitStore, currentAction: HistoryAction) => {
    const payload = currentAction.action?.payload as AddStickyCommandPayload;
    store.dispatch(CellActions.addSticky({ ...payload, historyMate: { ignore: true } }));
  },
  execute: (state: Draft<CellState>, payload: AddStickyCommandPayload) => {
    state.map[payload.id] = {
      style: {
        fontSize: 12,
      },
      ...payload,
      type: 'STICKY',
      children: [],
    };
  },
};

commandManager.register('Cell', 'addSticky', AddStickyCommand);
