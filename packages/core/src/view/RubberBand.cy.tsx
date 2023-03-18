import { Board } from './Board';
import { Provider } from 'react-redux';
import { CellActions, CellReduce } from '../store/CellSlice';
import { configureStore, Store } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { Rectangle } from '../model/Rectangle';
import { RootState } from '../store';

const BedTest = ({ store }: { store: Store<unknown> }) => {
  return (
    <Provider store={store}>
      <Board></Board>
    </Provider>
  );
};

xdescribe('测试框选', () => {
  let store: ToolkitStore;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        cell: CellReduce,
      },
    });
  });

  it('在空白处点击移动鼠标，将显示 RubberBand', () => {
    cy.mount(<BedTest store={store} />);
    cy.get('svg')
      .trigger('mousedown', { clientX: 100, clientY: 100 })
      .trigger('mousemove', { clientX: 200, clientY: 200 })
      .wait(100)
      .then(() => {
        cy.get('.mxRubberBand').should('have.length', 1);
      })
      .realMouseUp();
  });

  it('鼠标抬起后，RubberBand 将消失', () => {
    cy.mount(<BedTest store={store} />);
    cy.get('svg')
      .trigger('mousedown', { clientX: 100, clientY: 100 })
      .trigger('mousemove', { clientX: 200, clientY: 200 })
      .trigger('mouseup');
    cy.get('.mxRubberBand').should('have.length', 0);
  });

  it('向右下角方向框选出 100 * 100 的 RubberBand', () => {
    cy.mount(<BedTest store={store} />);
    cy.get('svg')
      .trigger('mousedown', { clientX: 100, clientY: 100 })
      .trigger('mousemove', { clientX: 200, clientY: 200 })
      .wait(100)
      .then(() => {
        const rubberBand = document.querySelector<HTMLElement>('.mxRubberBand');
        expect(rubberBand?.style.transform).eq('translate3d(100px, 100px, 0px)');
        expect(rubberBand?.style.width).eq('100px');
        expect(rubberBand?.style.height).eq('100px');
      })
      .trigger('mouseup');
  });

  it('向左上角方向框选出 50 * 50 的 RubberBand', () => {
    cy.mount(<BedTest store={store} />);
    cy.get('svg')
      .trigger('mousedown', { clientX: 100, clientY: 100 })
      .trigger('mousemove', { clientX: 50, clientY: 50 })
      .wait(100)
      .then(() => {
        const rubberBand = document.querySelector<HTMLElement>('.mxRubberBand');
        expect(rubberBand?.style.transform).eq('translate3d(50px, 50px, 0px)');
        expect(rubberBand?.style.width).eq('50px');
        expect(rubberBand?.style.height).eq('50px');
      })
      .trigger('mouseup');
  });

  it('选框与元素部分相交, 鼠标在元素区域内抬起，将元素选中显示选中框', () => {
    store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: new Rectangle(70, 70, 100, 100).toRectangleData() }));
    cy.mount(<BedTest store={store} />);

    cy.get('svg')
      .trigger('mousedown', { clientX: 50, clientY: 50 })
      .trigger('mousemove', { clientX: 100, clientY: 100 })
      .wait(50)
      .trigger('mouseup')
      .then(() => {
        cy.get('.mx-selection-box').should('have.length', 1);
      });
  });

  it('选框与元素部分相交, 鼠标在空白区域内抬起，将元素选中显示选中框', () => {
    store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: new Rectangle(70, 70, 100, 100).toRectangleData() }));
    cy.mount(<BedTest store={store} />);

    cy.get('svg')
      .trigger('mousedown', { clientX: 50, clientY: 50 })
      .trigger('mousemove', { clientX: 200, clientY: 100 })
      .wait(50)
      .trigger('mouseup')
      .then(() => {
        cy.get('.mx-selection-box').should('have.length', 1);
      });
  });

  it('框选多个元素时, selectedCellIds 为选中元素的 ID', () => {
    store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: new Rectangle(70, 70, 100, 100).toRectangleData() }));
    store.dispatch(CellActions.addSticky({ id: 'cell2', geometry: new Rectangle(70, 200, 100, 100).toRectangleData() }));
    cy.mount(<BedTest store={store} />);

    cy.get('svg')
      .trigger('mousedown', { clientX: 50, clientY: 50 })
      .trigger('mousemove', { clientX: 200, clientY: 220 })
      .wait(100)
      .trigger('mouseup')
      .then(() => {
        expect((store.getState() as RootState).cell.selectedCellIds).eqls(['cell1', 'cell2']);
      });
  });
});
