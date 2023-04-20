import { Draft } from '@reduxjs/toolkit';
import { Command } from './Command';
import { HistoryAction, HistoryMeta } from '../type/History';
import { CellActions, CellState } from '../CellSlice';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { PointData } from '../type/Cell';
import { Rectangle } from '../../model/Rectangle';
import { commandManager } from './CommandManager';

export type MoveCellCommandPayload = { id: string; point: PointData } & HistoryMeta;

export const MoveCellCommand: Command = {
  undo: (store: ToolkitStore, currentAction: HistoryAction, preAction: HistoryAction) => {
    let { id } = currentAction.action.payload as ReturnType<typeof CellActions.moveCell>['payload'];
    const snapshot = preAction.afterSnapshot[id];
    if (snapshot.geometry) {
      store.dispatch(CellActions.moveCell({ id, point: snapshot.geometry, historyMate: { ignore: true } }));
    }
  },
  redo: (store: ToolkitStore, currentAction: HistoryAction) => {
    let { id, point } = currentAction.action.payload as ReturnType<typeof CellActions.moveCell>['payload'];
    store.dispatch(CellActions.moveCell({ id, point, historyMate: { ignore: true } }));
  },
  execute: (state: Draft<CellState>, payload: MoveCellCommandPayload) => {
    const cell = state.map[payload.id];
    if (cell.geometry) {
      cell.geometry.x = payload.point.x;
      cell.geometry.y = payload.point.y;
      return;
    } else if (cell.points && cell.points.length > 1) {
      const { x, y } = Rectangle.fromPoints(cell.points) as Rectangle;
      const dx = payload.point.x - x;
      const dy = payload.point.y - y;
      cell.points = cell.points.map((point) => {
        point.x += dx;
        point.y += dy;
        return point;
      });
    }
  },
};

commandManager.register('Cell', 'moveCell', MoveCellCommand);
