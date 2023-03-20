import { Provider } from 'react-redux';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { configureStore, Store } from '@reduxjs/toolkit';
import { Board } from './Board';
import { CellActions, CellReduce } from '../store/CellSlice';

const BedTest = ({ store }: { store: Store<unknown> }) => {
  return (
    <Provider store={store}>
      <Board></Board>
    </Provider>
  );
};

describe('测试文本编辑器', () => {
  let store: ToolkitStore;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        cell: CellReduce,
      },
    });
  });

  it('初始状态时，将不显示文本编辑器', () => {
    cy.mount(<BedTest store={store} />);

    cy.get('.mxCellEditor').should('have.length', 0);
  });

  it('当双击元素选择框，将显示文本编辑器', () => {
    store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 50, y: 100, width: 70, height: 60 } }));
    cy.mount(<BedTest store={store} />);

    cy.get('[data-cell-id="cell1"]').click();
    cy.get('.mx-selection-box').dblclick();
    cy.get('.mxCellEditor').should('have.length', 1);
  });

  it('当显示文本编辑器时，将与元素的位置一致', () => {
    store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 50, y: 100, width: 70, height: 60 } }));
    store.dispatch(CellActions.editCell('cell1'));
    cy.mount(<BedTest store={store} />);
    cy.get('svg').then(() => {
      const { left, top, position } = (document.querySelector('.mxCellEditor') as HTMLDivElement).style;
      chai.expect(position).to.eq('absolute');
      chai.expect(left).to.eq('50px');
      chai.expect(top).to.eq('100px');
    });
  });

  it('当显示文本编辑器时，将与元素的大小一致', () => {
    store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 50, y: 100, width: 70, height: 60 } }));
    store.dispatch(CellActions.editCell('cell1'));
    cy.mount(<BedTest store={store} />);

    cy.get('svg').then(() => {
      const { width, height } = (document.querySelector('.mxCellEditor') as HTMLDivElement).style;
      chai.expect(width).to.eq('70px');
      chai.expect(height).to.eq('60px');
    });
  });

  describe('测试基于原点坐标放大 200％', () => {
    beforeEach(() => {
      store.dispatch(CellActions.scale({ scale: 2, basePoint: { x: 0, y: 0 } }));
      store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
      store.dispatch(CellActions.editCell('cell1'));
      cy.mount(<BedTest store={store} />);
    });

    it('当显示文本编辑器时，将与元素的位置一致', () => {
      cy.get('svg').then(() => {
        const { left, top } = (document.querySelector('.mxCellEditor') as HTMLDivElement).style;
        chai.expect(left).to.eq('100px');
        chai.expect(top).to.eq('100px');
      });
    });

    it('当显示文本编辑器时，将与元素的大小一致', () => {
      cy.get('svg').then(() => {
        const { width, height, transform } = (document.querySelector('.mxCellEditor') as HTMLDivElement).style;
        chai.expect(width).to.eq('100px');
        chai.expect(height).to.eq('100px');
        chai.expect(transform).to.eq('scale(2)');
      });
    });
  });

  describe('测试白板右下角偏移 50 px', () => {
    beforeEach(() => {
      store.dispatch(CellActions.translate({ x: 50, y: 50 }));
      store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
      store.dispatch(CellActions.editCell('cell1'));
      cy.mount(<BedTest store={store} />);
    });

    it('当显示文本编辑器时，将与元素的位置一致', () => {
      cy.get('svg').then(() => {
        const { left, top } = (document.querySelector('.mxCellEditor') as HTMLDivElement).style;
        chai.expect(left).to.eq('100px');
        chai.expect(top).to.eq('100px');
      });
    });
  });

  describe('测试白板右下角偏移 50 px 且放大 200%', () => {
    beforeEach(() => {
      store.dispatch(CellActions.translate({ x: 50, y: 50 }));
      store.dispatch(CellActions.scale({ scale: 2, basePoint: { x: 0, y: 0 } }));
      store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
      store.dispatch(CellActions.editCell('cell1'));
      cy.mount(<BedTest store={store} />);
    });

    it('当显示文本编辑器时，将与元素的位置一致', () => {
      cy.get('svg').then(() => {
        const { left, top } = (document.querySelector('.mxCellEditor') as HTMLDivElement).style;
        chai.expect(left).to.eq('200px');
        chai.expect(top).to.eq('200px');
      });
    });

    it('当显示文本编辑器时，将与元素的大小一致', () => {
      cy.get('svg').then(() => {
        const { width, height, transform } = (document.querySelector('.mxCellEditor') as HTMLDivElement).style;
        chai.expect(width).to.eq('100px');
        chai.expect(height).to.eq('100px');
        chai.expect(transform).to.eq('scale(2)');
      });
    });
  });

  it('当显示文本编辑器时，元素的文本临时隐藏', () => {
    store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
    store.dispatch(CellActions.editCell('cell1'));
    cy.mount(<BedTest store={store} />);

    cy.get("[data-cell-id='cell1'] foreignObject").should('not.be.visible');
  });

  it('当显示文本编辑器时，编辑器的文字与元素的文字相同', () => {
    store.dispatch(CellActions.addSticky({ id: 'cell1', text: 'hello', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
    store.dispatch(CellActions.editCell('cell1'));
    cy.mount(<BedTest store={store} />);

    cy.get('.mxCellEditor').should('have.text', 'hello');
  });

  describe('修改编辑器文字场景', () => {
    beforeEach(() => {
      store.dispatch(CellActions.addText({ id: 'text1', text: 'hello', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
      store.dispatch(CellActions.editCell('text1'));
      cy.spy(CellActions, 'resizeCell');
      cy.mount(<BedTest store={store} />);
    });

    it('当没有定义 autoWidth 样式时不会触发修改宽度 Actions', () => {
      cy.get('.mxCellEditor')
        .type('Hello, World')
        .then(() => {
          expect(CellActions.resizeCell).not.to.called;
        });
    });

    it('当样式 autoWidth=false 时不会触发修改宽度 Actions', () => {
      store.dispatch(CellActions.updateStyle({ ids: ['text1'], style: { autoWidth: false } }));

      cy.get('.mxCellEditor')
        .type('Hello, World')
        .then(() => {
          expect(CellActions.resizeCell).not.to.called;
        });
    });

    it('当样式 autoWidth=true 时触发修改宽度 Actions', () => {
      store.dispatch(CellActions.updateStyle({ ids: ['text1'], style: { autoWidth: true } }));

      cy.get('.mxCellEditor')
        .type('Hello, World')
        .then(() => {
          expect(CellActions.resizeCell).to.called;
        });
    });
  });

  describe('测试点击空白位置场景', () => {
    it('隐藏文本编辑器，恢复文本显示', () => {
      store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
      store.dispatch(CellActions.editCell('cell1'));
      cy.mount(<BedTest store={store} />);

      cy.get('body').click();
      cy.get("[data-cell-id='cell1'] foreignObject").should('be.visible');
      cy.get('.mxCellEditor').should('have.length', 0);
    });

    it('保存编辑中的文字', () => {
      store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
      store.dispatch(CellActions.editCell('cell1'));
      cy.mount(<BedTest store={store} />);

      cy.get('.mxCellEditor').type('Hello');
      cy.get('body').click();

      cy.get("[data-cell-id='cell1']").should('have.text', 'Hello');
    });

    it('当没有修改文本失去焦点时，不会触发 finishEditing Action', () => {
      cy.spy(CellActions, 'finishEditing');
      store.dispatch(CellActions.addSticky({ id: 'cell1', text: 'Hello', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
      store.dispatch(CellActions.editCell('cell1'));
      cy.mount(<BedTest store={store} />);

      cy.get('body').click();

      cy.get("[data-cell-id='cell1']").then(() => {
        expect(CellActions.finishEditing).not.called;
      });
    });
  });
});
