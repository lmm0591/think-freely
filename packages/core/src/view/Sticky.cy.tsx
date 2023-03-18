import { Board } from './Board';
import { Provider } from 'react-redux';
import { CellActions, CellReduce } from '../store/CellSlice';
import { configureStore, Store } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { Rectangle } from '../model/Rectangle';
import { Point } from '../model/Point';

const BedTest = ({ store }: { store: Store<unknown> }) => {
  return (
    <Provider store={store}>
      <Board></Board>
    </Provider>
  );
};

xdescribe('测试便利贴', () => {
  let store: ToolkitStore;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        cell: CellReduce,
      },
    });
  });

  function createdStickyAndMove({ geometry, moveToPoint }: { geometry: Rectangle; moveToPoint: Point }) {
    store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: geometry.toRectangleData() }));
    cy.mount(<BedTest store={store} />);
    cy.get('.mx-shape').trigger('mousedown', { clientX: geometry.x, clientY: geometry.x });
    cy.get('body').trigger('mousemove', { clientX: moveToPoint.x, clientY: moveToPoint.y }).trigger('mouseup');
  }

  it('移动便利贴', () => {
    createdStickyAndMove({
      geometry: new Rectangle(0, 0, 100, 100),
      moveToPoint: new Point(200, 100),
    });

    cy.get('.mx-shape').should('have.attr', 'transform', 'translate(200, 100)');
  });

  it('当白板右下角偏移 10 px，元素向 SE 方向移动 50 px 时, 元素 x 和 y 坐标增加 50 px', () => {
    store.dispatch(CellActions.translate({ x: 10, y: 10 }));
    createdStickyAndMove({
      geometry: new Rectangle(0, 0, 100, 100),
      moveToPoint: new Point(50, 50),
    });

    cy.get('.mx-shape').should('have.attr', 'transform', 'translate(50, 50)');
  });

  it('设置便利贴文字为 "hello", 显示文本', () => {
    store.dispatch(CellActions.addSticky({ id: 'cell1', text: 'hello', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
    cy.mount(<BedTest store={store} />);

    cy.get('[data-cell-id="cell1"] foreignObject').should('have.text', 'hello');
  });

  describe('测试基于原点坐标缩放 1 倍', () => {
    it('元素向 SE 移动 100px时，元素的向 SE 移动 25px', () => {
      store.dispatch(CellActions.scale({ scale: 2, basePoint: { x: 0, y: 0 } }));
      store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));

      cy.mount(<BedTest store={store} />);
      cy.get('[data-cell-id="cell1"]')
        .trigger('mousedown', { clientX: 100, clientY: 100 })
        .trigger('mousemove', { clientX: 150, clientY: 150 })
        .trigger('mouseup')
        .should('have.attr', 'transform', 'translate(75, 75)');
    });
  });

  describe('测试白板右下角偏移 50 px 且放大 1 倍', () => {
    it('元素向 SE 移动 100px 时，元素的向 SE 移动 50px', () => {
      store.dispatch(CellActions.scale({ scale: 2, basePoint: { x: 0, y: 0 } }));
      store.dispatch(CellActions.translate({ x: 50, y: 50 }));
      store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));

      cy.mount(<BedTest store={store} />);

      cy.get('[data-cell-id="cell1"]')
        .trigger('mousedown', { clientX: 150, clientY: 150 })
        .trigger('mousemove', { clientX: 250, clientY: 250 })
        .trigger('mouseup')
        .should('have.attr', 'transform', 'translate(100, 100)');
    });
  });
});
