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
      cy.get('[data-join-box] ellipse:eq(0)').should('have.attr', 'cx', '100').should('have.attr', 'cy', '50');
      cy.get('[data-join-box] ellipse:eq(1)').should('have.attr', 'cx', '150').should('have.attr', 'cy', '100');
      cy.get('[data-join-box] ellipse:eq(2)').should('have.attr', 'cx', '100').should('have.attr', 'cy', '150');
      cy.get('[data-join-box] ellipse:eq(3)').should('have.attr', 'cx', '50').should('have.attr', 'cy', '100');
    });

    it('拖动起点靠近便利贴，将显示被连接框', () => {
      cy.get('[data-point-index="0"]').mousedown(3, 3);
      cy.get('body').mousemove(150, 100);

      cy.get('[data-join-box]').should('exist');
      cy.get('[data-join-box] ellipse:eq(0)').should('have.attr', 'cx', '100').should('have.attr', 'cy', '50');
      cy.get('[data-join-box] ellipse:eq(1)').should('have.attr', 'cx', '150').should('have.attr', 'cy', '100');
      cy.get('[data-join-box] ellipse:eq(2)').should('have.attr', 'cx', '100').should('have.attr', 'cy', '150');
      cy.get('[data-join-box] ellipse:eq(3)').should('have.attr', 'cx', '50').should('have.attr', 'cy', '100');
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

    describe('测试偏移左下角 100 px 的场景', () => {
      beforeEach(() => {
        store.dispatch(CellActions.translate({ x: 100, y: 100 }));
      });

      it('拖动终点靠近便利贴，将显示被连接框', () => {
        cy.get('[data-point-index="1"]').mousedown(3, 3);
        cy.get('body').mousemove(150, 200);

        cy.get('[data-join-box]').should('exist');
        cy.get('[data-join-box] ellipse:eq(0)').should('have.attr', 'cx', '200').should('have.attr', 'cy', '150');
        cy.get('[data-join-box] ellipse:eq(1)').should('have.attr', 'cx', '250').should('have.attr', 'cy', '200');
        cy.get('[data-join-box] ellipse:eq(2)').should('have.attr', 'cx', '200').should('have.attr', 'cy', '250');
        cy.get('[data-join-box] ellipse:eq(3)').should('have.attr', 'cx', '150').should('have.attr', 'cy', '200');
      });

      it('拖动终点靠近便利贴，将显示修改后的连接线', () => {
        cy.get('[data-point-index="1"]').mousedown(3, 3);
        cy.get('body').mousemove(150, 200).mouseup(150, 200);

        cy.get('[data-shape-line] polyline').should('have.attr', 'points', '250,100 50,100');
      });
    });

    describe('测试缩放 200% 的场景', () => {
      beforeEach(() => {
        cy.viewport(800, 800);
        store.dispatch(CellActions.scale({ scale: 2, basePoint: { x: 0, y: 0 } }));
      });

      it('拖动终点靠近便利贴，将显示被连接框', () => {
        cy.get('[data-point-index="1"]').mousedown(3, 3);
        cy.get('body').mousemove(110, 200);

        cy.get('[data-join-box]').should('exist');
        cy.get('[data-join-box] ellipse:eq(0)').should('have.attr', 'cx', '200').should('have.attr', 'cy', '100');
        cy.get('[data-join-box] ellipse:eq(1)').should('have.attr', 'cx', '300').should('have.attr', 'cy', '200');
        cy.get('[data-join-box] ellipse:eq(2)').should('have.attr', 'cx', '200').should('have.attr', 'cy', '300');
        cy.get('[data-join-box] ellipse:eq(3)').should('have.attr', 'cx', '100').should('have.attr', 'cy', '200');
      });

      it('拖动终点靠近便利贴，将显示修改后的连接线', () => {
        cy.get('[data-point-index="1"]').mousedown(3, 3);
        cy.get('body').mousemove(110, 200).mouseup(110, 200);

        cy.get('[data-shape-line] polyline').should('have.attr', 'points', '250,100 50,100');
      });
    });

    describe('测试白板右下角偏移 50 px 且放大 200%', () => {
      beforeEach(() => {
        cy.viewport(800, 800);
        store.dispatch(CellActions.translate({ x: 50, y: 50 }));
        store.dispatch(CellActions.scale({ scale: 2, basePoint: { x: 0, y: 0 } }));
      });

      it('拖动终点靠近便利贴，将显示被连接框', () => {
        cy.get('[data-point-index="1"]').mousedown(3, 3);
        cy.get('body').mousemove(390, 300);

        cy.get('[data-join-box]').should('exist');
        cy.get('[data-join-box] ellipse:eq(0)').should('have.attr', 'cx', '300').should('have.attr', 'cy', '200');
        cy.get('[data-join-box] ellipse:eq(1)').should('have.attr', 'cx', '400').should('have.attr', 'cy', '300');
        cy.get('[data-join-box] ellipse:eq(2)').should('have.attr', 'cx', '300').should('have.attr', 'cy', '400');
        cy.get('[data-join-box] ellipse:eq(3)').should('have.attr', 'cx', '200').should('have.attr', 'cy', '300');
      });

      it('拖动终点靠近便利贴，将显示修改后的连接线', () => {
        cy.get('[data-point-index="1"]').mousedown(3, 3);
        cy.get('body').mousemove(390, 300).mouseup(390, 300);
        cy.get('[data-shape-line] polyline').should('have.attr', 'points', '250,100 150,100');
      });
    });
  });

  describe('测试便利贴与线条的起点连接', () => {
    beforeEach(() => {
      store.dispatch(CellActions.addSticky({ id: 'sticky1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
      store.dispatch(
        CellActions.addLine({
          id: 'line1',
          points: [{ x: 300, y: 200 }],
          source: { id: 'sticky1', direction: 'E' },
        }),
      );
      store.dispatch(CellActions.selectDisplayCells(['line1']));
      cy.mount(<BedTest store={store} />);
    });

    it('拖动到 W 方向，将显示修改后的连接线', () => {
      cy.get('[data-point-source]').mousedown(3, 3);
      cy.get('body').mousemove(60, 100).mouseup(60, 100);

      cy.get('[data-shape-line] polyline').should('have.attr', 'points', '50,100 300,200');
    });

    it('拖动到 W 方向，更新 cell 模型的连接属性', () => {
      cy.get('[data-point-source]').mousedown(3, 3);
      cy.get('body')
        .mousemove(60, 100)
        .mouseup(60, 100)
        .then(() => {
          const line = (store.getState() as RootState).cell.map['line1'];
          chai.expect(line.source).to.contain({ id: 'sticky1', direction: 'W' });
          chai.expect(line.target).to.undefined;
        });
    });

    it('拖动终点到另一个便利贴，将显示修改后的连接线', () => {
      store.dispatch(CellActions.addSticky({ id: 'sticky2', geometry: { x: 350, y: 50, width: 100, height: 100 } }));
      cy.get('[data-point-index="0"]').mousedown(3, 3);
      cy.get('body').mousemove(360, 100).mouseup(360, 100);

      cy.get('[data-shape-line] polyline').should('have.attr', 'points', '150,100 350,100');
    });
  });

  describe('测试便利贴与线条的终点连接', () => {
    beforeEach(() => {
      store.dispatch(CellActions.addSticky({ id: 'sticky1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
      store.dispatch(
        CellActions.addLine({
          id: 'line1',
          points: [{ x: 300, y: 200 }],
          target: { id: 'sticky1', direction: 'E' },
        }),
      );
      store.dispatch(CellActions.selectDisplayCells(['line1']));
      cy.mount(<BedTest store={store} />);
    });
    it('拖动到 W 方向，将显示修改后的连接线', () => {
      cy.get('[data-point-target]').mousedown(3, 3);
      cy.get('body').mousemove(60, 100).mouseup(60, 100);

      cy.get('[data-shape-line] polyline').should('have.attr', 'points', '300,200 50,100');
    });

    it('拖动到 W 方向，更新 cell 模型的连接属性', () => {
      cy.get('[data-point-target]').mousedown(3, 3);
      cy.get('body')
        .mousemove(60, 100)
        .mouseup(60, 100)
        .then(() => {
          const line = (store.getState() as RootState).cell.map['line1'];
          chai.expect(line.target).to.contain({ id: 'sticky1', direction: 'W' });
          chai.expect(line.source).to.undefined;
        });
    });

    it('拖动起点到另一个便利贴，将显示修改后的连接线', () => {
      store.dispatch(CellActions.addSticky({ id: 'sticky2', geometry: { x: 350, y: 50, width: 100, height: 100 } }));
      cy.get('[data-point-index="0"]').mousedown(3, 3);
      cy.get('body').mousemove(360, 100).mouseup(360, 100);

      cy.get('[data-shape-line] polyline').should('have.attr', 'points', '350,100 150,100');
    });

    it('拖动起点到另一个便利贴，将显示增加拐点按钮', () => {
      store.dispatch(CellActions.addSticky({ id: 'sticky2', geometry: { x: 350, y: 50, width: 100, height: 100 } }));
      cy.get('[data-point-index="0"]').mousedown(3, 3);
      cy.get('body').mousemove(360, 100).mouseup(360, 100);

      cy.get('[data-add-pointer]').should('be.visible', true);
    });
  });

  xit('移动线条的终点位置到自己便利贴上，将不显示被连接框', () => {});
});
