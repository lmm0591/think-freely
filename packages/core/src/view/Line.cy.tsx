import { Board } from './Board';
import { Provider } from 'react-redux';
import { CellActions, CellReduce } from '../store/CellSlice';
import { configureStore, Store } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { ArrowType, CellStyle, PointData } from '../store/type/Cell';
import { RootState } from '../store';

const BedTest = ({ store }: { store: Store<unknown> }) => {
  return (
    <Provider store={store}>
      <Board></Board>
    </Provider>
  );
};

const addLine = (store: ToolkitStore, id: string, points: PointData[], style: CellStyle = {}) => {
  return store.dispatch(CellActions.addLine({ id, points, style }));
};

describe('测试线条', () => {
  let store: ToolkitStore;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        cell: CellReduce,
      },
    });
  });

  it('显示线条', () => {
    addLine(store, 'cell1', [
      { x: 10, y: 10 },
      { x: 110, y: 110 },
    ]);
    cy.mount(<BedTest store={store} />);
    cy.get('.mx-shape polyline').should('have.attr', 'points', '10,10 110,110');
  });

  it('点击线条时，显示线条选中框', () => {
    addLine(store, 'cell1', [
      { x: 10, y: 10 },
      { x: 110, y: 110 },
    ]);
    cy.mount(<BedTest store={store} />);
    cy.get('[data-cell-id="cell1"]').click();
    cy.get('.mx-line-selection-box').should('have.length', 1);
  });

  describe('测试便利贴与线条连接后场景', () => {
    describe('线条的起点连接到便利贴', () => {
      beforeEach(() => {
        store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
        store.dispatch(
          CellActions.addLine({
            id: 'line1',
            source: {
              id: 'cell1',
              direction: 'E',
            },
            points: [{ x: 200, y: 200 }],
          }),
        );
        cy.mount(<BedTest store={store} />);
      });

      it('连接后的显示', () => {
        cy.get('[data-cell-id="line1"] polyline').should('have.attr', 'points', '150,100 200,200');
      });

      it('移动便利贴', () => {
        cy.get('[data-cell-id="cell1"]').mousedown(20, 20);
        cy.get('body').mousemove(150, 70).mouseup(150, 70);
        cy.get('[data-cell-id="line1"] polyline').should('have.attr', 'points', '230,100 200,200');
      });

      it('移动线条终点', () => {
        cy.get('[data-cell-id="line1"]').click();
        cy.get('[data-resizer-line]').last().mousedown(2, 2);
        cy.get('body').mousemove(250, 170).mouseup(250, 170);
        cy.get('[data-cell-id="line1"] polyline').should('have.attr', 'points', '150,100 250,170');
      });

      it('删除便利贴时线条也删除', () => {
        store.dispatch(CellActions.deleteCells({ cellIds: ['cell1'] }));
        chai.expect((store.getState() as RootState).cell.map['line1']).to.undefined;
      });

      it('当选中的线条被动删除时,会取消线条的选中态', () => {
        store.dispatch(CellActions.selectDisplayCells(['line1']));
        store.dispatch(CellActions.deleteCells({ cellIds: ['cell1'] }));
        chai.expect((store.getState() as RootState).cell.selectedCellIds).to.length(0);
      });
    });

    describe('线条的终点连接到便利贴', () => {
      beforeEach(() => {
        store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 200, y: 200, width: 100, height: 100 } }));
        store.dispatch(
          CellActions.addLine({
            id: 'line1',
            target: {
              id: 'cell1',
              direction: 'W',
            },
            points: [{ x: 100, y: 100 }],
          }),
        );
        cy.mount(<BedTest store={store} />);
      });

      it('连接后的显示', () => {
        cy.get('[data-cell-id="line1"] polyline').should('have.attr', 'points', '100,100 200,250');
      });

      it('移动便利贴', () => {
        cy.get('[data-cell-id="cell1"]').mousedown(20, 20);
        cy.get('body').mousemove(320, 220).mouseup(320, 220);
        cy.get('[data-cell-id="line1"] polyline').should('have.attr', 'points', '100,100 300,250');
      });

      it('移动线条始点', () => {
        cy.get('[data-cell-id="line1"]').click();
        cy.get('[data-resizer-line][data-point-index=0]').mousedown(2, 2);
        cy.get('body').mousemove(150, 50).mouseup(150, 50);
        cy.get('[data-cell-id="line1"] polyline').should('have.attr', 'points', '150,50 200,250');
      });

      it('删除便利贴时线条也删除', () => {
        store.dispatch(CellActions.deleteCells({ cellIds: ['cell1'] }));
        chai.expect((store.getState() as RootState).cell.map['line1']).to.undefined;
      });

      it('当选中的线条被动删除时,会取消线条的选中态', () => {
        store.dispatch(CellActions.selectDisplayCells(['line1']));
        store.dispatch(CellActions.deleteCells({ cellIds: ['cell1'] }));
        chai.expect((store.getState() as RootState).cell.selectedCellIds).to.length(0);
      });
    });

    describe('线条的起点和终点都连接到便利贴', () => {
      beforeEach(() => {
        store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
        store.dispatch(CellActions.addSticky({ id: 'cell2', geometry: { x: 300, y: 200, width: 100, height: 100 } }));

        store.dispatch(
          CellActions.addLine({
            id: 'line1',
            source: {
              id: 'cell1',
              direction: 'E',
            },
            target: {
              id: 'cell2',
              direction: 'W',
            },
          }),
        );
        cy.mount(<BedTest store={store} />);
      });

      it('连接后的显示', () => {
        cy.get('[data-cell-id="line1"] polyline').should('have.attr', 'points', '150,100 300,250');
      });

      it('删除起点便利贴时线条也删除', () => {
        store.dispatch(CellActions.deleteCells({ cellIds: ['cell1'] }));
        chai.expect((store.getState() as RootState).cell.map['line1']).to.undefined;
      });

      it('删除终点便利贴时线条也删除', () => {
        store.dispatch(CellActions.deleteCells({ cellIds: ['cell2'] }));
        chai.expect((store.getState() as RootState).cell.map['line1']).to.undefined;
      });
    });
  });

  describe('测试移动线条场景', () => {
    it('移动直线', () => {
      addLine(store, 'cell1', [
        { x: 10, y: 10 },
        { x: 110, y: 110 },
      ]);
      cy.mount(<BedTest store={store} />);
      cy.get('body')
        .mousedown(20, 20)
        .mousemove(120, 120)
        .mousemove(120, 120)
        .mouseup(120, 120)
        .then(() => {
          chai.expect((store.getState() as RootState).cell.map['cell1'].points).eql([
            { x: 110, y: 110 },
            { x: 210, y: 210 },
          ]);
        });
    });

    it('放大 200% 时移动直线', () => {
      addLine(store, 'cell1', [
        { x: 10, y: 10 },
        { x: 110, y: 110 },
      ]);
      store.dispatch(CellActions.scale({ scale: 2, basePoint: { x: 0, y: 0 } }));
      cy.mount(<BedTest store={store} />);
      cy.get('body').mousedown(20, 20).mousemove(120, 120).mouseup(120, 120);
      cy.get('[data-cell-id="cell1"] polyline').should('have.attr', 'points', '60,60 160,160');
    });

    it('白板偏移 20px 时移动直线', () => {
      addLine(store, 'cell1', [
        { x: 10, y: 10 },
        { x: 110, y: 110 },
      ]);
      store.dispatch(CellActions.translate({ x: 20, y: 20 }));
      cy.mount(<BedTest store={store} />);
      cy.get('body').mousedown(30, 30).mousemove(130, 130).mouseup(130, 130);
      cy.get('[data-cell-id="cell1"] polyline').should('have.attr', 'points', '110,110 210,210');
    });

    it('放大 200% 且白板偏移 10px 时移动直线', () => {
      addLine(store, 'cell1', [
        { x: 10, y: 10 },
        { x: 110, y: 110 },
      ]);
      store.dispatch(CellActions.translate({ x: 10, y: 10 }));
      store.dispatch(CellActions.scale({ scale: 2, basePoint: { x: 0, y: 0 } }));
      cy.mount(<BedTest store={store} />);
      cy.get('body').mousedown(40, 40).mousemove(140, 140).mouseup(140, 140);
      cy.get('[data-cell-id="cell1"] polyline').should('have.attr', 'points', '60,60 160,160');
    });

    it('移动折线', () => {
      addLine(store, 'cell1', [
        { x: 100, y: 100 },
        { x: 0, y: 0 },
        { x: 50, y: 150 },
      ]);
      cy.mount(<BedTest store={store} />);

      cy.get('body').mousedown(50, 50).mousemove(150, 150).mouseup(150, 150);
      cy.get('[data-cell-id="cell1"] polyline').should('have.attr', 'points', '200,200 100,100 150,250');
    });
  });

  describe('测试显示箭头', () => {
    const points = [
      { x: 10, y: 10 },
      { x: 110, y: 110 },
    ];

    it('显示没有箭头', () => {
      addLine(store, 'cell1', points);
      cy.mount(<BedTest store={store} />);
      cy.get('.mx-shape polyline').should('not.have.attr', 'marker-end');
      cy.get('.mx-shape polyline').should('not.have.attr', 'marker-start');
    });

    it('显示结束位置的箭头', () => {
      addLine(store, 'cell1', points, { endArrow: 'block' });
      cy.mount(<BedTest store={store} />);
      cy.get('.mx-shape polyline').should('have.attr', 'marker-end', 'url(#think-freely-block)');
    });

    it('显示开始位置的箭头', () => {
      addLine(store, 'cell1', points, { startArrow: 'block' });
      cy.mount(<BedTest store={store} />);
      cy.get('.mx-shape polyline').should('have.attr', 'marker-start', 'url(#think-freely-block)');
    });

    describe('测试各种箭头种类', () => {
      (['block', 'blockThin', 'open', 'oval', 'ovalThin', 'diamond', 'diamondThin'] as ArrowType[]).forEach((key) => {
        it(`显示 ${key} 箭头`, () => {
          addLine(store, 'cell1', points, { endArrow: key });
          cy.mount(<BedTest store={store} />);
          cy.get(`#think-freely-${key}`).should('have.length', 1);
          cy.get('.mx-shape polyline').should('have.attr', 'marker-end', `url(#think-freely-${key})`);
        });
      });
    });
  });
});
