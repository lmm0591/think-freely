import { Board } from '../Board';
import { Provider } from 'react-redux';
import { configureStore, Store } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { CellActions, CellReduce } from '../../store/CellSlice';
import { RootState } from '../../store';
import { CellStyle, PointData } from '../../store/type/Cell';

const BedTest = ({ store }: { store: Store<unknown> }) => {
  return (
    <Provider store={store}>
      <Board></Board>
    </Provider>
  );
};

describe('测试线条选择框', () => {
  let store: ToolkitStore;

  const addLine = (store: ToolkitStore, id: string, points: PointData[], style: CellStyle = {}) => {
    return store.dispatch(CellActions.addLine({ id, points, style }));
  };

  beforeEach(() => {
    store = configureStore({ reducer: { cell: CellReduce } });
  });

  it('显示选择框', () => {
    addLine(store, 'cell1', [
      { x: 50, y: 50 },
      { x: 150, y: 150 },
    ]);
    store.dispatch(CellActions.selectDisplayCells(['cell1']));
    cy.mount(<BedTest store={store} />);

    cy.get('.mx-line-selection-box').should('have.length', 1);
    cy.get('[data-point-index="0"]').should('have.attr', 'cx', 50).should('have.attr', 'cy', 50);
    cy.get('[data-point-index="1"]').should('have.attr', 'cx', 150).should('have.attr', 'cy', 150);
  });

  describe('测试显示折线场景', () => {
    beforeEach(() => {
      addLine(store, 'cell1', [
        { x: 50, y: 50 },
        { x: 150, y: 50 },
        { x: 50, y: 150 },
      ]);
      store.dispatch(CellActions.selectDisplayCells(['cell1']));
      cy.mount(<BedTest store={store} />);
    });

    it('显示多个调整拐点按钮', () => {
      cy.get('[data-resizer-line]').should('have.length', 3);
      cy.get('[data-resizer-line]').eq(0).should('have.attr', 'cx', 50).should('have.attr', 'cy', 50);
      cy.get('[data-resizer-line]').eq(1).should('have.attr', 'cx', 150).should('have.attr', 'cy', 50);
      cy.get('[data-resizer-line]').eq(2).should('have.attr', 'cx', 50).should('have.attr', 'cy', 150);
    });

    it('显示多个创建拐点', () => {
      cy.get('[data-add-pointer]').should('have.length', 2);
      cy.get('[data-add-pointer]').eq(0).should('have.attr', 'cx', 100).should('have.attr', 'cy', 50);
      cy.get('[data-add-pointer]').eq(1).should('have.attr', 'cx', 100).should('have.attr', 'cy', 100);
    });

    it('显示多条线段', () => {
      cy.get('[data-cell-id="cell1"] polyline').eq(0).should('have.attr', 'points', '50,50 150,50 50,150');
    });
  });

  it('显示增加拐点按钮', () => {
    addLine(store, 'cell1', [
      { x: 50, y: 50 },
      { x: 150, y: 150 },
    ]);
    store.dispatch(CellActions.selectDisplayCells(['cell1']));
    cy.mount(<BedTest store={store} />);

    cy.get('[data-add-pointer]').should('have.length', 1).should('have.attr', 'cx', 100).should('have.attr', 'cy', 100);
  });

  it('移动增加拐点按钮，增加新的拐点', () => {
    addLine(store, 'cell1', [
      { x: 50, y: 50 },
      { x: 150, y: 150 },
    ]);
    store.dispatch(CellActions.selectDisplayCells(['cell1']));
    cy.mount(<BedTest store={store} />);
    cy.get('body').mousedown(100, 100).mousemove(150, 50).mouseup(150, 50);
    cy.get('[data-add-pointer]').should('have.attr', 'cx', 100).should('have.attr', 'cy', 50);
  });

  it('移动起点, 将调整线条的起点坐标', () => {
    addLine(store, 'cell1', [
      { x: 50, y: 50 },
      { x: 150, y: 150 },
    ]);
    store.dispatch(CellActions.selectDisplayCells(['cell1']));
    cy.mount(<BedTest store={store} />);
    cy.get('body')
      .mousedown(50, 50)
      .mousemove(0, 0)
      .mouseup(0, 0)
      .then(() => {
        chai.expect((store.getState() as RootState).cell.map['cell1'].points).eql([
          { x: 0, y: 0 },
          { x: 150, y: 150 },
        ]);
      });
  });

  describe('测试偏移左下角 100 px 的场景', () => {
    beforeEach(() => {
      addLine(store, 'cell1', [
        { x: 50, y: 50 },
        { x: 150, y: 150 },
      ]);
      store.dispatch(CellActions.translate({ x: 100, y: 100 }));
      store.dispatch(CellActions.selectDisplayCells(['cell1']));
      cy.mount(<BedTest store={store} />);
    });

    it('显示选择框', () => {
      cy.get('[data-point-index="0"]').should('have.attr', 'cx', 150).should('have.attr', 'cy', 150);
      cy.get('[data-point-index="1"]').should('have.attr', 'cx', 250).should('have.attr', 'cy', 250);
    });

    it('移动起点，将调整线条的起点坐标', () => {
      cy.get('body')
        .mousedown(150, 150)
        .mousemove(100, 100)
        .mouseup(100, 100)
        .then(() => {
          chai.expect((store.getState() as RootState).cell.map['cell1'].points).eql([
            { x: 0, y: 0 },
            { x: 150, y: 150 },
          ]);
        });
    });

    it('移动增加拐点按钮，增加新的拐点', () => {
      cy.get('body').mousedown(200, 200).mousemove(300, 200).mouseup(300, 200);

      cy.get('[data-point-index="0"]').should('have.attr', 'cx', 150).should('have.attr', 'cy', 150);
      cy.get('[data-point-index="1"]').should('have.attr', 'cx', 300).should('have.attr', 'cy', 200);
      cy.get('[data-point-index="2"]').should('have.attr', 'cx', 250).should('have.attr', 'cy', 250);
    });
  });

  describe('测试缩放 200% 的场景', () => {
    beforeEach(() => {
      addLine(store, 'cell1', [
        { x: 50, y: 50 },
        { x: 150, y: 150 },
      ]);
      store.dispatch(CellActions.scale({ scale: 2, basePoint: { x: 0, y: 0 } }));
      store.dispatch(CellActions.selectDisplayCells(['cell1']));
      cy.mount(<BedTest store={store} />);
    });

    it('显示选择框', () => {
      cy.get('[data-point-index="0"]').should('have.attr', 'cx', 100).should('have.attr', 'cy', 100);
      cy.get('[data-point-index="1"]').should('have.attr', 'cx', 300).should('have.attr', 'cy', 300);
    });

    it('移动起点，将调整线条的起点坐标', () => {
      cy.get('body')
        .mousedown(100, 100)
        .mousemove(50, 50)
        .mouseup(50, 50)
        .then(() => {
          chai.expect((store.getState() as RootState).cell.map['cell1'].points).eql([
            { x: 25, y: 25 },
            { x: 150, y: 150 },
          ]);
        });
    });

    it('移动增加拐点按钮，增加新的拐点', () => {
      cy.get('body').mousedown(200, 200).mousemove(300, 200).mouseup(300, 200);

      cy.get('[data-point-index="0"]').should('have.attr', 'cx', 100).should('have.attr', 'cy', 100);
      cy.get('[data-point-index="1"]').should('have.attr', 'cx', 300).should('have.attr', 'cy', 200);
      cy.get('[data-point-index="2"]').should('have.attr', 'cx', 300).should('have.attr', 'cy', 300);
    });
  });

  describe('测试偏移左下角 50 px 并缩放 200% 的场景', () => {
    beforeEach(() => {
      addLine(store, 'cell1', [
        { x: 50, y: 50 },
        { x: 150, y: 150 },
      ]);
      store.dispatch(CellActions.translate({ x: 50, y: 50 }));
      store.dispatch(CellActions.scale({ scale: 2, basePoint: { x: 0, y: 0 } }));
      store.dispatch(CellActions.selectDisplayCells(['cell1']));
      cy.mount(<BedTest store={store} />);
    });

    it('显示选择框', () => {
      cy.get('[data-point-index="0"]').should('have.attr', 'cx', 200).should('have.attr', 'cy', 200);
      cy.get('[data-point-index="1"]').should('have.attr', 'cx', 400).should('have.attr', 'cy', 400);
    });

    it('移动起点，将调整线条的起点坐标', () => {
      cy.get('body')
        .mousedown(200, 200)
        .mousemove(100, 100)
        .mouseup(100, 100)
        .then(() => {
          chai.expect((store.getState() as RootState).cell.map['cell1'].points).eql([
            { x: 0, y: 0 },
            { x: 150, y: 150 },
          ]);
        });
    });

    it('移动增加拐点按钮，增加新的拐点', () => {
      cy.get('body').mousedown(300, 300).mousemove(400, 300).mouseup(400, 300);

      cy.get('[data-point-index="0"]').should('have.attr', 'cx', 200).should('have.attr', 'cy', 200);
      cy.get('[data-point-index="1"]').should('have.attr', 'cx', 400).should('have.attr', 'cy', 300);
      cy.get('[data-point-index="2"]').should('have.attr', 'cx', 400).should('have.attr', 'cy', 400);
    });
  });

  describe('测试连接元素场景', () => {
    beforeEach(() => {
      store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 100, y: 100, width: 100, height: 100 } }));
      store.dispatch(CellActions.addLine({ id: 'line1', points: [{ x: 300, y: 300 }], source: { id: 'cell1', direction: 'E' } }));
      store.dispatch(CellActions.selectDisplayCells(['line1']));
      cy.mount(<BedTest store={store} />);
    });

    it('显示选择框', () => {
      cy.get('[data-point-source]').should('have.attr', 'cx', 200).should('have.attr', 'cy', 150);
      cy.get('[data-point-index="0"]').should('have.attr', 'cx', 300).should('have.attr', 'cy', 300);
    });
  });
});
