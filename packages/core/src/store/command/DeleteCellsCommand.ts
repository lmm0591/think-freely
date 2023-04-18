import { Draft } from '@reduxjs/toolkit';
import difference from 'lodash.difference';
import { Command } from './Command';
import { HistoryAction, HistoryMeta } from '../type/History';
import { CellActions, CellState } from '../CellSlice';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';

export type DeleteCellsCommandPayload = { cellIds: string[] } & HistoryMeta;

export const DeleteCellsCommand: Command = {
  undo: (store: ToolkitStore, currentAction: HistoryAction) => {
    let { cellIds } = currentAction.action.payload as ReturnType<typeof CellActions.deleteCells>['payload'];
    cellIds.forEach((id) => {
      const snapshot = currentAction.snapshot[id];
      store.dispatch(CellActions.addSticky({ id, geometry: snapshot.geometry, historyMate: { ignore: true } }));
    });
  },
  redo: (store: ToolkitStore, currentAction: HistoryAction) => {
    const { cellIds } = currentAction.action?.payload as ReturnType<typeof CellActions.deleteCells>['payload'];
    store.dispatch(CellActions.deleteCells({ cellIds, historyMate: { ignore: true } }));
  },
  execute: (state: Draft<CellState>, { cellIds }: DeleteCellsCommandPayload) => {
    const connectLines = Object.values(state.map).filter((cell) => cell.type === 'LINE' && (cell.source || cell.target));
    cellIds.forEach((cellId) => {
      connectLines.forEach((line) => {
        if (line.source?.id === cellId || line.target?.id === cellId) {
          delete state.map[line.id];
          state.selectedCellIds = difference(state.selectedCellIds, [line.id]);
        }
      });
      delete state.map[cellId];
    });
    state.selectedCellIds = difference(state.selectedCellIds, cellIds);
  },
};
