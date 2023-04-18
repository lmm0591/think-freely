import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { CellActions } from './CellSlice';
import { HistoryActions } from './HistorySlice';
import { RootState } from '.';
import { CreateStore } from './CreateStore';

describe('测试 HistorySlice', () => {
  let store: ToolkitStore<RootState>;
  beforeEach(() => {
    store = CreateStore();
  });

  describe('测试创建便利贴场景', () => {
    beforeEach(() => {
      store.dispatch(CellActions.addSticky({ id: 'sticky1', geometry: { x: 0, y: 0, width: 100, height: 100 } }));
    });

    it('记录操作日志', () => {
      chai.expect(store.getState().history.actions[0].action).deep.contain({
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

  describe('测试删除便利贴场景', () => {
    beforeEach(() => {
      store.dispatch(CellActions.addSticky({ id: 'sticky1', geometry: { x: 0, y: 0, width: 100, height: 100 } }));
      store.dispatch(CellActions.deleteCells({ cellIds: ['sticky1'] }));
    });

    it('删除便利贴，记录快照', () => {
      chai.expect(store.getState().history.actions[1].snapshot.sticky1).deep.contain({
        geometry: { x: 0, y: 0, width: 100, height: 100 },
        id: 'sticky1',
        type: 'STICKY',
      });
    });

    it('触发撤销操作，将取消删除', () => {
      store.dispatch(HistoryActions.undo({ historyMate: { ignore: true } }));
      chai.expect(store.getState().cell.map['sticky1'].geometry).eql({ x: 0, y: 0, width: 100, height: 100 });
      chai.expect(store.getState().history.index).to.equal(0);
    });

    it('触发撤销再触发重做，将重新删除', () => {
      store.dispatch(HistoryActions.undo({ historyMate: { ignore: true } }));
      store.dispatch(HistoryActions.redo({ historyMate: { ignore: true } }));
      chai.expect(store.getState().cell.map['sticky1']).be.undefined;
      chai.expect(store.getState().history.index).to.equal(1);
    });
  });

  describe('测试移动便利贴场景', () => {
    beforeEach(() => {
      store.dispatch(CellActions.addSticky({ id: 'sticky1', geometry: { x: 0, y: 0, width: 100, height: 100 } }));
      store.dispatch(CellActions.moveCell({ id: 'sticky1', point: { x: 100, y: 100 } }));
    });

    it('移动便利贴，记录快照', () => {
      chai.expect(store.getState().history.actions[1].snapshot.sticky1).deep.contain({
        geometry: { x: 0, y: 0, width: 100, height: 100 },
        id: 'sticky1',
        type: 'STICKY',
      });
    });

    it('触发撤销操作，将便利贴移回之前位置', () => {
      store.dispatch(HistoryActions.undo({ historyMate: { ignore: true } }));
      chai.expect(store.getState().cell.map['sticky1'].geometry).eql({ x: 0, y: 0, width: 100, height: 100 });
      chai.expect(store.getState().history.index).to.equal(0);
    });

    it('触发撤销再触发重做，将重新移动一遍', () => {
      store.dispatch(HistoryActions.undo({ historyMate: { ignore: true } }));
      store.dispatch(HistoryActions.redo({ historyMate: { ignore: true } }));
      chai.expect(store.getState().cell.map['sticky1'].geometry).eql({ x: 100, y: 100, width: 100, height: 100 });
      chai.expect(store.getState().history.index).to.equal(1);
    });
  });
});
