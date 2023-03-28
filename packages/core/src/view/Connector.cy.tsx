import { Store, configureStore } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { Provider } from 'react-redux';
import { Board } from './Board';
import { CellActions, CellReduce } from '../store/CellSlice';

const BedTest = ({ store }: { store: Store<unknown> }) => {
  return (
    <Provider store={store}>
      <Board></Board>
    </Provider>
  );
};

describe('测试连接器', () => {
  let store: ToolkitStore;
  beforeEach(() => {
    store = configureStore({ reducer: { cell: CellReduce } });
  });

  it('点击元素,显示连接器', () => {
    store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
    cy.mount(<BedTest store={store} />);

    cy.get('body').click(80, 80);

    cy.get('[data-connector]').should('be.visible', true);
  });

  it('点击空白位置,隐藏连接器', () => {
    store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
    cy.mount(<BedTest store={store} />);
    cy.get('body').click(80, 80);

    cy.get('body').click(280, 280);

    chai.expect(document.querySelector('[data-connector]')).to.null;
  });

  it('删除元素时,隐藏连接器', () => {
    store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
    store.dispatch(CellActions.selectDisplayCells(['cell1']));
    cy.mount(<BedTest store={store} />);

    store.dispatch(CellActions.deleteCells({ cellIds: ['cell1'] }));

    chai.expect(document.querySelector('[data-connector]')).to.null;
  });

  it('连接点在选中元素的四周', () => {
    store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
    cy.mount(<BedTest store={store} />);

    store.dispatch(CellActions.selectDisplayCells(['cell1']));

    cy.get('[data-connector] ellipse:eq(0)').should('have.attr', 'cx', '100');
    cy.get('[data-connector] ellipse:eq(0)').should('have.attr', 'cy', '36');

    cy.get('[data-connector] ellipse:eq(1)').should('have.attr', 'cx', '164');
    cy.get('[data-connector] ellipse:eq(1)').should('have.attr', 'cy', '100');

    cy.get('[data-connector] ellipse:eq(2)').should('have.attr', 'cx', '100');
    cy.get('[data-connector] ellipse:eq(2)').should('have.attr', 'cy', '164');

    cy.get('[data-connector] ellipse:eq(3)').should('have.attr', 'cx', '36');
    cy.get('[data-connector] ellipse:eq(3)').should('have.attr', 'cy', '100');
  });

  describe('测试拖拽连接点场景', () => {
    beforeEach(() => {
      store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
      store.dispatch(CellActions.selectDisplayCells(['cell1']));
      cy.mount(<BedTest store={store} />);
    });

    it('拖拽出一条连接线', () => {
      cy.get('[data-connector] ellipse:eq(0)').mousedown(3, 3);
      cy.get('body').mousemove(300, 100);

      cy.get('[data-drawing-line] polyline').should('have.attr', 'points', '100,36 300,100');
    });

    it('拖拽完成后隐藏绘制预览元素', () => {
      cy.get('[data-connector] ellipse:eq(0)').mousedown(3, 3);
      cy.get('body').mousemove(300, 100).mouseup(300, 100);

      cy.get('[data-drawing-line] polyline').should('not.exist');
    });
  });
});
