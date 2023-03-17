import { Board } from './Board';
import { Provider } from 'react-redux';
import { configureStore, Store } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { CellActions, CellReduce } from '../store/CellSlice';

const BedTest = ({ store }: { store: Store<unknown> }) => {
  return (
    <Provider store={store}>
      <Board></Board>
    </Provider>
  );
};

describe('测试背景', () => {
  let store: ToolkitStore;
  beforeEach(() => {
    store = configureStore({ reducer: { cell: CellReduce } });
  });

  describe('测试移动白板', () => {
    it('白板右下角偏移 10 px，背景标签 transform 属性变成 transform="translate(-90, -90)"', () => {
      store.dispatch(CellActions.translate({ x: 10, y: 10 }));
      cy.mount(<BedTest store={store} />);

      cy.get('.mx-grid-background').should('have.attr', 'transform', 'translate(-90, -90)');
    });

    it('白板左上角偏移 210 px，背景标签 transform 属性变成 transform="translate(-110, -110)"', () => {
      store.dispatch(CellActions.translate({ x: -210, y: -210 }));
      cy.mount(<BedTest store={store} />);

      cy.get('.mx-grid-background').should('have.attr', 'transform', 'translate(-110, -110)');
    });

    it('白板右下角偏移 120 px，背景标签 transform 属性变成 transform="translate(-80, -80)"', () => {
      store.dispatch(CellActions.translate({ x: 120, y: 120 }));
      cy.mount(<BedTest store={store} />);

      cy.get('.mx-grid-background').should('have.attr', 'transform', 'translate(-80, -80)');
    });
  });

  describe('测试缩放白板', () => {
    it('白板基于原点坐标缩放 1 倍', () => {
      store.dispatch(CellActions.scale({ scale: 2, basePoint: { x: 0, y: 0 } }));
      cy.mount(<BedTest store={store} />);

      cy.get('#mx-graph-pattern').should('have.attr', 'width', '200').should('have.attr', 'height', '200');
      cy.get('#mx-graph-pattern path').should('have.attr', 'd', 'M 200 0 L 0 0 0 200');
    });

    it('白板基于原点坐标缩放 0.5 倍', () => {
      store.dispatch(CellActions.scale({ scale: 0.5, basePoint: { x: 0, y: 0 } }));
      cy.mount(<BedTest store={store} />);

      cy.get('#mx-graph-pattern').should('have.attr', 'width', '50').should('have.attr', 'height', '50');
      cy.get('#mx-graph-pattern path').should('have.attr', 'd', 'M 50 0 L 0 0 0 50');
    });
  });
});
