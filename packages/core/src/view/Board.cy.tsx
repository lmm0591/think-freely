import { Board } from './Board';
import { Provider } from 'react-redux';
import { CellActions, CellReduce } from '../store/CellSlice';
import { configureStore, Store } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';

const BedTest = ({ store }: { store: Store<unknown> }) => {
  return (
    <Provider store={store}>
      <Board></Board>
    </Provider>
  );
};

describe('测试白板', () => {
  let store: ToolkitStore;
  beforeEach(() => {
    store = configureStore({ reducer: { cell: CellReduce } });
  });

  describe('测试 mx-canvas 场景', () => {
    it('当白板偏移 10px 时，.mx-canvas 标签也偏移 10 px', () => {
      store.dispatch(CellActions.translate({ x: 10, y: 10 }));
      cy.mount(<BedTest store={store} />);

      cy.get('.mx-canvas').should('have.attr', 'transform', 'translate(10, 10) scale(1)');
    });
    it('当白板放大 150% 时，.mx-canvas 标签也放大 200%', () => {
      store.dispatch(CellActions.scale({ scale: 1.5, basePoint: { x: 0, y: 0 } }));
      store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));

      cy.mount(<BedTest store={store} />);
      cy.get('.mx-canvas').should('have.attr', 'transform', 'translate(0, 0) scale(1.5)');
    });
  });

  describe('框选元素', () => {
    it('白板放大 150% 时, 选中元素', () => {
      store.dispatch(CellActions.scale({ scale: 1.5, basePoint: { x: 0, y: 0 } }));
      store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 0, y: 0, width: 100, height: 100 } }));
      cy.mount(<BedTest store={store} />);

      cy.get('body').mousedown(300, 300).mousemove(150, 150).mouseup(150, 150);
      cy.get('.mx-selection-box').should('have.length', 1);
    });

    it('白板偏移 100px 时, 选中元素', () => {
      store.dispatch(CellActions.translate({ x: 100, y: 100 }));
      store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 0, y: 0, width: 100, height: 100 } }));
      cy.mount(<BedTest store={store} />);

      cy.get('body').mousedown(300, 300).mousemove(200, 200).mouseup(200, 200);
      cy.get('.mx-selection-box').should('have.length', 1);
    });

    it('白板偏移 100 px 并放大 200%, 选中元素', () => {
      store.dispatch(CellActions.translate({ x: 100, y: 100 }));
      store.dispatch(CellActions.scale({ scale: 2, basePoint: { x: 0, y: 0 } }));

      store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 0, y: 0, width: 100, height: 100 } }));
      cy.mount(<BedTest store={store} />);

      cy.get('body').mousedown(0, 0).mousemove(200, 200).mouseup(200, 200);
      cy.get('.mx-selection-box').should('have.length', 1);
    });
  });

  describe('框选直线', () => {
    beforeEach(() => {
      store.dispatch(
        CellActions.addLine({
          id: 'cell1',
          points: [
            { x: 100, y: 100 },
            { x: 200, y: 100 },
          ],
        }),
      );
    });

    it('没有选中直线', () => {
      cy.mount(<BedTest store={store} />);
      cy.get('svg').mousedown(50, 50).mousemove(99, 99).mouseup(99, 99);

      cy.get('.mx-line-selection-box').should('have.length', 0);
    });

    it('选中直线', () => {
      cy.mount(<BedTest store={store} />);
      cy.get('svg').mousedown(50, 50).mousemove(110, 110).mouseup(110, 110);

      cy.get('.mx-line-selection-box').should('have.length', 1);
    });

    it('白板放大 150% 时，选中直线', () => {
      store.dispatch(CellActions.scale({ scale: 1.5, basePoint: { x: 0, y: 0 } }));
      cy.mount(<BedTest store={store} />);
      cy.get('svg').mousedown(50, 50).mousemove(160, 160).mouseup(160, 160);

      cy.get('.mx-line-selection-box').should('have.length', 1);
    });

    it('白板偏移 10px 时，选中直线', () => {
      store.dispatch(CellActions.translate({ x: 50, y: 50 }));
      cy.mount(<BedTest store={store} />);
      cy.get('svg').mousedown(50, 50).mousemove(160, 160).mouseup(160, 160);

      cy.get('.mx-line-selection-box').should('have.length', 1);
    });

    it('白板偏移 10px 且放大 150% 时，选中直线', () => {
      store.dispatch(CellActions.translate({ x: 10, y: 10 }));
      store.dispatch(CellActions.scale({ scale: 1.5, basePoint: { x: 0, y: 0 } }));
      cy.mount(<BedTest store={store} />);
      cy.get('svg').mousedown(50, 50).mousemove(180, 180).mouseup(180, 180);

      cy.get('.mx-line-selection-box').should('have.length', 1);
    });
  });

  describe('框选多折线', () => {
    beforeEach(() => {
      store.dispatch(
        CellActions.addLine({
          id: 'cell1',
          points: [
            { x: 100, y: 100 },
            { x: 200, y: 50 },
            { x: 300, y: 100 },
          ],
        }),
      );
    });

    it('选中多折线', () => {
      cy.mount(<BedTest store={store} />);
      cy.get('svg').mousedown(250, 50).mousemove(300, 150).mouseup(300, 150);
      cy.get('.mx-line-selection-box').should('have.length', 1);
    });

    it('白板放大 150% 时，选中多折线', () => {
      store.dispatch(CellActions.scale({ scale: 1.5, basePoint: { x: 0, y: 0 } }));
      cy.mount(<BedTest store={store} />);
      cy.get('svg').mousedown(410, 50).mousemove(450, 210).mouseup(450, 210);

      cy.get('.mx-line-selection-box').should('have.length', 1);
    });

    it('白板偏移 10px 时，选中多折线', () => {
      store.dispatch(CellActions.translate({ x: 50, y: 50 }));
      cy.mount(<BedTest store={store} />);
      cy.get('svg').mousedown(270, 50).mousemove(360, 160).mouseup(360, 160);

      cy.get('.mx-line-selection-box').should('have.length', 1);
    });

    it('白板偏移 10px 且放大 150% 时，选中多折线', () => {
      store.dispatch(CellActions.translate({ x: 10, y: 10 }));
      store.dispatch(CellActions.scale({ scale: 1.5, basePoint: { x: 0, y: 0 } }));
      cy.mount(<BedTest store={store} />);
      cy.get('svg').mousedown(410, 50).mousemove(450, 210).mouseup(450, 210);

      cy.get('.mx-line-selection-box').should('have.length', 1);
    });
  });
});
