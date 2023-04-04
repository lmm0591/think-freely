import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { CellActions } from './CellSlice';
import { HistoryActions } from './HistorySlice';
import { RootState } from '.';
import { CreateStore } from './CreateStore';

describe('测试 HistorySlice', () => {
  let store: ToolkitStore<RootState>;
  beforeEach(() => {
    store = CreateStore();
    store.dispatch(CellActions.addSticky({ id: 'sticky1', geometry: { x: 0, y: 0, width: 100, height: 100 } }));
  });

  describe('测试创建便利贴场景', () => {
    it('记录操作日志', () => {
      chai.expect(store.getState().history.actions[0]).deep.contain({
        type: 'Cell/addSticky',
        payload: {
          id: 'sticky1',
          geometry: { x: 0, y: 0, width: 100, height: 100 },
        },
      });
    });

    it('触发撤销操作,将取消创建', () => {
      store.dispatch(HistoryActions.undo({ historyMate: { ignore: true } }));
      chai.expect(store.getState().cell.map['sticky1']).be.undefined;
      chai.expect(store.getState().history.index).to.equal(-1);
    });

    it('多次触发撤销，将忽略请求', () => {
      store.dispatch(HistoryActions.undo({ historyMate: { ignore: true } }));
      store.dispatch(HistoryActions.undo({ historyMate: { ignore: true } }));
      store.dispatch(HistoryActions.undo({ historyMate: { ignore: true } }));

      chai.expect(store.getState().history.index).to.equal(-1);
    });

    it('触发撤销再触发重做,将重新创建', () => {
      store.dispatch(HistoryActions.undo({ historyMate: { ignore: true } }));
      store.dispatch(HistoryActions.redo({ historyMate: { ignore: true } }));
      chai.expect(store.getState().cell.map['sticky1'].geometry).eql({ x: 0, y: 0, width: 100, height: 100 });
      chai.expect(store.getState().history.index).to.equal(0);
    });

    it('多次触发重做，将忽略请求', () => {
      store.dispatch(HistoryActions.redo({ historyMate: { ignore: true } }));
      store.dispatch(HistoryActions.redo({ historyMate: { ignore: true } }));
      store.dispatch(HistoryActions.redo({ historyMate: { ignore: true } }));

      chai.expect(store.getState().history.index).to.equal(0);
    });
  });
});
