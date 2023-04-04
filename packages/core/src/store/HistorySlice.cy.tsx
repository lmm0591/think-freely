import { configureStore } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { CellActions, CellReduce } from './CellSlice';
import { HistoryReduce } from './HistorySlice';
import { UndoMiddleware } from './middleware/UndoMiddleware';

describe('测试 HistorySlice', () => {
  let store: ToolkitStore;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        cell: CellReduce,
        history: HistoryReduce,
      },
      middleware: [UndoMiddleware],
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
});
