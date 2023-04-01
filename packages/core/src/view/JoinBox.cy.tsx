import { Provider } from 'react-redux';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { configureStore, Store } from '@reduxjs/toolkit';
import { Board } from './Board';
import { CellActions, CellReduce } from '../store/CellSlice';
import { RootState } from '../store';

const BedTest = ({ store }: { store: Store<unknown> }) => {
  return (
    <Provider store={store}>
      <Board></Board>
    </Provider>
  );
};

describe('测试被连接框', () => {
  let store: ToolkitStore;
  beforeEach(() => {
    store = configureStore({ reducer: { cell: CellReduce } });
  });

  describe('测试移动线条连接便利贴', () => {
    beforeEach(() => {
      store.dispatch(CellActions.addSticky({ id: 'sticky1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
      store.dispatch(
        CellActions.addLine({
          id: 'line1',
          points: [
            { x: 250, y: 100 },
            { x: 300, y: 200 },
          ],
        }),
      );
      store.dispatch(CellActions.selectDisplayCells(['line1']));
      cy.mount(<BedTest store={store} />);
    });

    it('拖动终点靠近便利贴，将显示被连接框', () => {
      cy.get('[data-point-index="1"]').mousedown(3, 3);
      cy.get('body').mousemove(150, 100);

      cy.get('[data-join-box]').should('exist');
    });

    it('拖动起点靠近便利贴，将显示被连接框', () => {
      cy.get('[data-point-index="0"]').mousedown(3, 3);
      cy.get('body').mousemove(150, 100);

      cy.get('[data-join-box]').should('exist');
    });

    it('终点与便利贴连接成功，显示修改后的连接线', () => {
      cy.get('[data-point-index="1"]').mousedown(3, 3);
      cy.get('body').mousemove(150, 100).mouseup(150, 100);

      cy.get('[data-shape-line] polyline').should('have.attr', 'points', '250,100 150,100');
    });

    it('起点与便利贴连接成功，显示修改后的连接线', () => {
      cy.get('[data-point-index="0"]').mousedown(3, 3);
      cy.get('body').mousemove(150, 100).mouseup(150, 100);

      cy.get('[data-shape-line] polyline').should('have.attr', 'points', '150,100 300,200');
    });

    it('终点与便利贴连接成功，更新 cell 模型的 target 属性', () => {
      cy.get('[data-point-index="1"]').mousedown(3, 3);
      cy.get('body')
        .mousemove(150, 100)
        .mouseup(150, 100)
        .then(() => {
          chai.expect((store.getState() as RootState).cell.map['line1'].target).to.contain({ id: 'sticky1', direction: 'E' });
        });
    });

    it('起点与便利贴连接成功，更新 cell 模型的 source 属性', () => {
      cy.get('[data-point-index="0"]').mousedown(3, 3);
      cy.get('body')
        .mousemove(150, 100)
        .mouseup(150, 100)
        .then(() => {
          chai.expect((store.getState() as RootState).cell.map['line1'].source).to.contain({ id: 'sticky1', direction: 'E' });
        });
    });
  });

  xit('移动线条的终点位置到自己便利贴上，将不显示被连接框', () => {});
});
