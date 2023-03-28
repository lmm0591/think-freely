import { Provider } from 'react-redux';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { configureStore, Store } from '@reduxjs/toolkit';
import { Board } from '../../view/Board';
import { CellReduce } from '../../store/CellSlice';
import { RootState } from '../../store';

const BedTest = ({ store }: { store: Store<unknown> }) => {
  return (
    <Provider store={store}>
      <Board></Board>
    </Provider>
  );
};

describe('测试缩放器', () => {
  let store: ToolkitStore;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        cell: CellReduce,
      },
    });
  });

  it('滚动鼠标滚轮, 白板纵向移动', () => {
    cy.mount(<BedTest store={store} />);
    cy.get('body')
      .trigger('wheel', { deltaX: 0, deltaY: 50 })
      .then(() => {
        const { y } = (store.getState() as RootState).cell.translate;
        chai.expect(y).to.eql(-50);
      });
  });

  it('按 shift 滚动鼠标滚轮, 白板横向移动', () => {
    cy.mount(<BedTest store={store} />);
    cy.get('body')
      .trigger('wheel', { deltaX: 50, deltaY: 0 })
      .then(() => {
        const { x } = (store.getState() as RootState).cell.translate;
        chai.expect(x).to.eql(-50);
      });
  });

  it('按 ctrlKey 滚动鼠标滚轮, 白板缩放', () => {
    cy.mount(<BedTest store={store} />);
    cy.get('body')
      .trigger('wheel', { ctrlKey: true, deltaX: 50, deltaY: 0 })
      .then(() => {
        const { translate, scale } = (store.getState() as RootState).cell;
        chai.expect(translate).to.contains({ x: 50, y: 50 });
        chai.expect(scale).to.eql(0.8);
      });
  });

  it('按 metaKey 滚动鼠标滚轮, 白板缩放', () => {
    cy.mount(<BedTest store={store} />);
    cy.get('body')
      .trigger('wheel', { metaKey: true, deltaX: 50, deltaY: 0 })
      .then(() => {
        const { translate, scale } = (store.getState() as RootState).cell;
        chai.expect(translate).to.contains({ x: 50, y: 50 });
        chai.expect(scale).to.eql(0.8);
      });
  });
});
