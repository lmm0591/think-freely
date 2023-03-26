import { configureStore, Store } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { Provider } from 'react-redux';
import { CellActions, CellReduce } from '../../store/CellSlice';
import { Board } from '../Board';

const BedTest = ({ store }: { store: Store<unknown> }) => {
  return (
    <Provider store={store}>
      <Board></Board>
    </Provider>
  );
};

describe('测试线条创建时场景', () => {
  let store: ToolkitStore;
  beforeEach(() => {
    store = configureStore({ reducer: { cell: CellReduce } });
  });

  it('初始状态时不显示线条', () => {
    cy.mount(<BedTest store={store} />);
    cy.get('[data-drawing-line]').should('not.exist');
  });

  it('通过模型显示绘制中的线条', () => {
    store.dispatch(
      CellActions.startDrawLine({
        points: [
          { x: 0, y: 0 },
          { x: 100, y: 100 },
        ],
      }),
    );
    cy.mount(<BedTest store={store} />);
    cy.get('[data-drawing-line] polyline').should('exist').should('have.attr', 'points', '0,0 100,100');
  });
});
