import { Board } from './Board';
import { Provider } from 'react-redux';
import { configureStore, Store } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { CellActions, CellReduce } from '../store/CellSlice';
import { Rectangle } from '../model/Rectangle';
import { DirectionFour } from './type/SelectionBox';
import { Point } from '../model/Point';

const BedTest = ({ store }: { store: Store<unknown> }) => {
  return (
    <Provider store={store}>
      <Board></Board>
    </Provider>
  );
};

describe('测试单选择框', () => {
  let store: ToolkitStore;
  beforeEach(() => {
    store = configureStore({ reducer: { cell: CellReduce } });
  });

  function createdStickyAndMove({
    geometry,
    direction,
    moveToPoint,
  }: {
    geometry: Rectangle;
    direction: DirectionFour;
    moveToPoint: Point;
  }) {
    store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: geometry.toRectangleData() }));
    cy.mount(<BedTest store={store} />);
    cy.get('.mx-shape').click();
    cy.get(`.mx-resizer[data-direction='${direction}']`).trigger('mousedown');
    cy.get('body')
      .trigger('mousemove', { clientX: moveToPoint.x, clientY: moveToPoint.y })
      .trigger('mousemove', { clientX: moveToPoint.x, clientY: moveToPoint.y })
      .trigger('mouseup');
  }

  it('点击元素时，显示选择框', () => {
    store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { ...new Rectangle(10, 10, 100, 100) } }));
    cy.mount(<BedTest store={store} />);
    cy.get('.mx-shape').click();
    cy.get('.mx-selection-box').should('have.length', 1);
  });

  it('点击白板的空白位置时，取消选择框', () => {
    store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { ...new Rectangle(10, 10, 100, 100) } }));
    cy.mount(<BedTest store={store} />);
    cy.get('.mx-shape').click();
    cy.get('body').click();
    cy.get('.mx-selection-box').should('have.length', 0);
  });

  describe('测试调整元素大小', () => {
    it('当 E 方向的 resizer 往右移动时，便利贴变宽', () => {
      createdStickyAndMove({
        geometry: new Rectangle(10, 10, 100, 100),
        direction: 'E',
        moveToPoint: new Point(200, 100),
      });

      cy.get('.mx-shape rect').should('have.attr', 'width', 190).should('have.attr', 'height', 100);
    });

    it('当 E 方向的 resizer 往左移动时，便利贴变窄', () => {
      createdStickyAndMove({
        geometry: new Rectangle(10, 10, 100, 100),
        direction: 'E',
        moveToPoint: new Point(100, 100),
      });

      cy.get('.mx-shape rect').should('have.attr', 'width', 90).should('have.attr', 'height', 100);
    });

    it('当 E 方向的 resizer 往左移动到 W 方向 resizer 的左边时，便利贴水平翻转', () => {
      createdStickyAndMove({
        geometry: new Rectangle(100, 10, 100, 100),
        direction: 'E',
        moveToPoint: new Point(10, 100),
      });

      cy.get('.mx-shape rect').should('have.attr', 'width', 90);
      cy.get('.mx-shape').should('have.attr', 'transform', 'translate(10, 10)');
    });

    it('当 W 方向的 resizer 往右移动时，便利贴变窄', () => {
      createdStickyAndMove({
        geometry: new Rectangle(100, 100, 100, 100),
        direction: 'W',
        moveToPoint: new Point(110, 150),
      });

      cy.get('.mx-shape rect').should('have.attr', 'width', 90);
      cy.get('.mx-shape').should('have.attr', 'transform', 'translate(110, 100)');
    });

    it('当 W 方向的 resizer 往左移动时，便利贴变宽', () => {
      createdStickyAndMove({
        geometry: new Rectangle(100, 10, 100, 100),
        direction: 'W',
        moveToPoint: new Point(10, 50),
      });

      cy.get('.mx-shape rect').should('have.attr', 'width', 190);
      cy.get('.mx-shape').should('have.attr', 'transform', 'translate(10, 10)');
    });

    it('当 W 方向的 resizer 往右移动到 E 方向的 resizer 的右边时，便利贴水平翻转', () => {
      createdStickyAndMove({
        geometry: new Rectangle(100, 100, 100, 100),
        direction: 'W',
        moveToPoint: new Point(290, 150),
      });

      cy.get('.mx-shape rect').should('have.attr', 'width', 90);
      cy.get('.mx-shape').should('have.attr', 'transform', 'translate(200, 100)');
    });

    it('当 N 方向的 resizer 往下移动时，便利贴变矮', () => {
      createdStickyAndMove({
        geometry: new Rectangle(100, 100, 100, 100),
        direction: 'N',
        moveToPoint: new Point(150, 110),
      });

      cy.get('.mx-shape rect').should('have.attr', 'height', 90);
      cy.get('.mx-shape').should('have.attr', 'transform', 'translate(100, 110)');
    });

    it('当 N 方向的 resizer 往下移动到 S 方向的 resizer 的下边时，便利贴垂直翻转', () => {
      createdStickyAndMove({
        geometry: new Rectangle(100, 100, 100, 100),
        direction: 'N',
        moveToPoint: new Point(150, 290),
      });

      cy.get('.mx-shape rect').should('have.attr', 'height', 90);
      cy.get('.mx-shape').should('have.attr', 'transform', 'translate(100, 200)');
    });

    it('当 N 方向的 resizer 往上移动时，便利贴变高', () => {
      createdStickyAndMove({
        geometry: new Rectangle(100, 100, 100, 100),
        direction: 'N',
        moveToPoint: new Point(10, 50),
      });

      cy.get('.mx-shape rect').should('have.attr', 'height', 150);
      cy.get('.mx-shape').should('have.attr', 'transform', 'translate(100, 50)');
    });

    it('当 S 方向的 resizer 往上移动时，便利贴变矮', () => {
      createdStickyAndMove({
        geometry: new Rectangle(100, 100, 100, 100),
        direction: 'S',
        moveToPoint: new Point(150, 190),
      });

      cy.get('.mx-shape rect').should('have.attr', 'height', 90);
      cy.get('.mx-shape').should('have.attr', 'transform', 'translate(100, 100)');
    });

    it('当 S 方向的 resizer 往上移动到 N 方向的 resizer 的上边时，便利贴垂直翻转', () => {
      createdStickyAndMove({
        geometry: new Rectangle(100, 100, 100, 100),
        direction: 'S',
        moveToPoint: new Point(100, 10),
      });

      cy.get('.mx-shape rect').should('have.attr', 'height', 90);
      cy.get('.mx-shape').should('have.attr', 'transform', 'translate(100, 10)');
    });

    it('当 S 方向的 resizer 往下移动时，便利贴变高', () => {
      createdStickyAndMove({
        geometry: new Rectangle(100, 100, 100, 100),
        direction: 'S',
        moveToPoint: new Point(100, 250),
      });

      cy.get('.mx-shape rect').should('have.attr', 'height', 150);
      cy.get('.mx-shape').should('have.attr', 'transform', 'translate(100, 100)');
    });

    it('当进行二次对 resizer 进行移动时，便利贴依然会产生变化', () => {
      createdStickyAndMove({
        geometry: new Rectangle(100, 100, 100, 100),
        direction: 'S',
        moveToPoint: new Point(100, 250),
      });
      cy.get(`.mx-resizer[data-direction='S']`).trigger('mousedown');
      cy.get('body').trigger('mousemove', { clientX: 100, clientY: 260 }).trigger('mouseup');

      cy.get('.mx-shape rect').should('have.attr', 'height', 160);
    });

    describe('测试便利贴最小显示', () => {
      it('由 E 向 W 调整到 10 宽度，显示元素最小宽度', () => {
        createdStickyAndMove({
          geometry: new Rectangle(100, 100, 100, 100),
          direction: 'E',
          moveToPoint: new Point(110, 150),
        });

        cy.get('.mx-shape rect').should('have.attr', 'width', 70);
        cy.get('.mx-shape').should('have.attr', 'transform', 'translate(100, 100)');
      });

      it('由 E 向 W 水平翻转，显示元素显示最小宽度', () => {
        createdStickyAndMove({
          geometry: new Rectangle(100, 100, 100, 100),
          direction: 'E',
          moveToPoint: new Point(90, 150),
        });

        cy.get('.mx-shape rect').should('have.attr', 'width', 70);
        cy.get('.mx-shape').should('have.attr', 'transform', 'translate(30, 100)');
      });

      it('由 W 向 E 调整到 10 宽度，显示元素最小宽度', () => {
        createdStickyAndMove({
          geometry: new Rectangle(100, 100, 100, 100),
          direction: 'W',
          moveToPoint: new Point(190, 150),
        });

        cy.get('.mx-shape rect').should('have.attr', 'width', 70);
        cy.get('.mx-shape').should('have.attr', 'transform', 'translate(130, 100)');
      });

      it('由 W 向 E 水平翻转，显示元素显示最小宽度', () => {
        createdStickyAndMove({
          geometry: new Rectangle(100, 100, 100, 100),
          direction: 'W',
          moveToPoint: new Point(210, 150),
        });

        cy.get('.mx-shape rect').should('have.attr', 'width', 70);
        cy.get('.mx-shape').should('have.attr', 'transform', 'translate(200, 100)');
      });

      it('由 N 向 S 调整到 10 高度，显示元素最小高度', () => {
        createdStickyAndMove({
          geometry: new Rectangle(100, 100, 100, 100),
          direction: 'N',
          moveToPoint: new Point(150, 190),
        });

        cy.get('.mx-shape rect').should('have.attr', 'height', 70);
        cy.get('.mx-shape').should('have.attr', 'transform', 'translate(100, 130)');
      });

      it('由 N 向 S 垂直翻转，显示元素显示最小高度', () => {
        createdStickyAndMove({
          geometry: new Rectangle(100, 100, 100, 100),
          direction: 'N',
          moveToPoint: new Point(150, 210),
        });

        cy.get('.mx-shape rect').should('have.attr', 'height', 70);
        cy.get('.mx-shape').should('have.attr', 'transform', 'translate(100, 200)');
      });

      it('由 S 向 N 调整到 10 高度，显示元素最小高度', () => {
        createdStickyAndMove({
          geometry: new Rectangle(100, 100, 100, 100),
          direction: 'S',
          moveToPoint: new Point(150, 110),
        });

        cy.get('.mx-shape rect').should('have.attr', 'height', 70);
        cy.get('.mx-shape').should('have.attr', 'transform', 'translate(100, 100)');
      });

      it('由 S 向 N 垂直翻转，显示元素显示最小高度', () => {
        createdStickyAndMove({
          geometry: new Rectangle(100, 100, 100, 100),
          direction: 'S',
          moveToPoint: new Point(150, 90),
        });

        cy.get('.mx-shape rect').should('have.attr', 'height', 70);
        cy.get('.mx-shape').should('have.attr', 'transform', 'translate(100, 30)');
      });
    });
  });

  describe('移动元素', () => {
    it('移动一个元素', () => {
      store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { ...new Rectangle(10, 10, 100, 100) } }));
      store.dispatch(CellActions.selectDisplayCells(['cell1']));
      cy.mount(<BedTest store={store} />);
      cy.get('.mx-selection-box')
        .trigger('mousedown', { clientX: 60, clientY: 60 })
        .trigger('mousemove', { clientX: 300, clientY: 300 })
        .trigger('mouseup', { clientX: 300, clientY: 300 })
        .should('have.attr', 'transform', 'translate(250, 250)');
    });
  });

  describe('测试基于原点坐标缩放 1 倍', () => {
    beforeEach(() => {
      store.dispatch(CellActions.scale({ scale: 2, basePoint: { x: 0, y: 0 } }));
      store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));

      cy.mount(<BedTest store={store} />);
    });

    it('框选的坐标为 (100, 100)，大小为 200*200', () => {
      cy.get('[data-cell-id="cell1"]').click();
      cy.get('.mx-selection-box')
        .should('have.attr', 'transform', 'translate(100, 100)')
        .should('have.attr', 'height', '200')
        .should('have.attr', 'width', '200');
    });

    it('移动选框向 SE 移动 100px时，框选的坐标为 (200, 200)', () => {
      cy.get('[data-cell-id="cell1"]').click();
      cy.get('.mx-selection-box')
        .trigger('mousedown', { clientX: 100, clientY: 100 })
        .trigger('mousemove', { clientX: 200, clientY: 200 })
        .trigger('mouseup')
        .should('have.attr', 'transform', 'translate(200, 200)');
    });

    it('当 E 方向的 resizer 往右移动 100 px时，框选加宽 100px', () => {
      cy.get('[data-cell-id="cell1"]').click();
      cy.get(`.mx-resizer[data-direction='E']`).trigger('mousedown');
      cy.get('body').trigger('mousemove', { clientX: 400, clientY: 200 }).trigger('mouseup');

      cy.get('.mx-selection-box').should('have.attr', 'width', '300');
    });
  });

  describe('测试白板右下角偏移 10px 后的场景', () => {
    beforeEach(() => {
      store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: new Rectangle(50, 50, 100, 100).toRectangleData() }));
      store.dispatch(CellActions.translate({ x: 10, y: 10 }));
      cy.mount(<BedTest store={store} />);
    });

    it('当框选到坐标为 (50, 50) 的元素时，框选的坐标为 (50, 50)', () => {
      cy.get('[data-cell-id="cell1"]')
        .click()
        .then(() => {
          cy.get('.mx-selection-box').should('have.attr', 'transform', 'translate(60, 60)');
        });
    });

    it('移动选框向 SE 方向移动 50 px 时, 里面的元素向 SE 方向移动 50 px', () => {
      cy.get('[data-cell-id="cell1"]').click();
      cy.get('.mx-selection-box')
        .trigger('mousedown', { clientX: 60, clientY: 60 })
        .trigger('mousemove', { clientX: 110, clientY: 110 })
        .trigger('mouseup')
        .should('have.attr', 'transform', 'translate(110, 110)');
    });
  });

  describe('测试白板右下角偏移 50 px 且放大 1 倍', () => {
    it('元素坐标为(50, 50)时，选框的坐标为(150, 150)', () => {
      store.dispatch(CellActions.scale({ scale: 2, basePoint: { x: 0, y: 0 } }));
      store.dispatch(CellActions.translate({ x: 50, y: 50 }));
      store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
      cy.mount(<BedTest store={store} />);

      cy.get('[data-cell-id="cell1"]').click();

      cy.get('.mx-selection-box').should('have.attr', 'transform', 'translate(150, 150)');
    });
  });
});

describe('测试多选框', () => {
  let store: ToolkitStore;
  beforeEach(() => {
    store = configureStore({ reducer: { cell: CellReduce } });
  });

  it('当 selectedCellIds 为多个值时，选择框包裹多个元素', () => {
    store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { ...new Rectangle(50, 50, 100, 100) } }));
    store.dispatch(CellActions.addSticky({ id: 'cell2', geometry: { ...new Rectangle(50, 250, 100, 100) } }));
    store.dispatch(CellActions.selectDisplayCells(['cell1', 'cell2']));

    cy.mount(<BedTest store={store} />);

    cy.get('.mx-selection-box')
      .should('have.attr', 'transform', 'translate(50, 50)')
      .should('have.attr', 'width', '100')
      .should('have.attr', 'height', '300');
  });

  describe('包裹线条和便利贴', () => {
    beforeEach(() => {
      store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { ...new Rectangle(50, 50, 100, 100) } }));
      store.dispatch(
        CellActions.addLine({
          id: 'line1',
          points: [
            { x: 50, y: 150 },
            { x: 100, y: 175 },
            { x: 150, y: 250 },
          ],
        }),
      );
      store.dispatch(CellActions.selectDisplayCells(['cell1', 'line1']));
      cy.mount(<BedTest store={store} />);
    });

    it('显示选择框', () => {
      cy.get('.mx-selection-box')
        .should('have.attr', 'transform', 'translate(50, 50)')
        .should('have.attr', 'height', '200')
        .should('have.attr', 'width', '100');
    });

    it('移动线条和便利贴', () => {
      cy.get('body').mousedown(60, 60).mousemove(160, 160).mouseup(160, 160);

      cy.get('.mx-selection-box')
        .should('have.attr', 'transform', 'translate(150, 150)')
        .should('have.attr', 'height', '200')
        .should('have.attr', 'width', '100');
    });

    it('修改线条和便利贴的大小', () => {
      cy.get('body').mousedown(50, 200).mousemove(100, 200).mouseup(100, 200);

      cy.get('.mx-selection-box')
        .should('have.attr', 'transform', 'translate(100, 50)')
        .should('have.attr', 'height', '200')
        .should('have.attr', 'width', '50');
    });
  });

  it('当移动选框时，选中元素一起移动', () => {
    store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { ...new Rectangle(50, 50, 100, 100) } }));
    store.dispatch(CellActions.addSticky({ id: 'cell2', geometry: { ...new Rectangle(50, 250, 100, 100) } }));
    store.dispatch(CellActions.selectDisplayCells(['cell1', 'cell2']));
    cy.mount(<BedTest store={store} />);

    cy.get('.mx-selection-box')
      .trigger('mousedown', { clientX: 100, clientY: 100 })
      .trigger('mousemove', { clientX: 200, clientY: 200 })
      .trigger('mouseup', { clientX: 200, clientY: 200 })
      .then(() => {
        cy.get('[data-cell-id="cell1"]').should('have.attr', 'transform', 'translate(150, 150)');
        cy.get('[data-cell-id="cell2"]').should('have.attr', 'transform', 'translate(150, 350)');
      });
  });
});
