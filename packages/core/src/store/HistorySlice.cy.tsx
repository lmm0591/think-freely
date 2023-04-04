import { configureStore } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { CellActions, CellReduce } from './CellSlice';
import { HistoryActions } from './HistorySlice';
import { HistoryReduce } from './HistorySlice';
import { UndoMiddleware } from './middleware/UndoMiddleware';
import { RootState } from '.';

describe('测试 HistorySlice', () => {
  let store: ToolkitStore<RootState>;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        cell: CellReduce,
        history: HistoryReduce,
      },
      middleware: [UndoMiddleware as any],
    });
  });

  it('当创建便利贴时，将记录操作', () => {
    store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 0, y: 0, width: 100, height: 100 } }));
    chai.expect(store.getState().history.actions[0]).deep.contain({
      type: 'Cell/addSticky',
      payload: {
        id: 'cell1',
        geometry: { x: 0, y: 0, width: 100, height: 100 },
      },
    });
  });

  it('当创建便利贴后出发 Undo,将取消创建', () => {
    store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 0, y: 0, width: 100, height: 100 } }));
    store.dispatch(HistoryActions.undo({ historyMate: { history: true } }));
    chai.expect(store.getState().cell.map['cell1']).be.undefined;
    chai.expect(store.getState().history.index).to.equal(0);
  });
});
