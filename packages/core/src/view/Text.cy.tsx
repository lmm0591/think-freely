import { Board } from './Board';
import { Provider } from 'react-redux';
import { CellActions, CellReduce } from '../store/CellSlice';
import { configureStore, Store } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';

const BedTest = ({ store }: { store: Store<unknown> }) => {
  return (
    <Provider store={store}>
      <Board></Board>
    </Provider>
  );
};

describe('测试文本元素', () => {
  let store: ToolkitStore;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        cell: CellReduce,
      },
    });
  });

  it('创建文本元素', () => {
    store.dispatch(CellActions.addText({ id: 'text1', text: 'Hello', geometry: { x: 50, y: 50, width: 100, height: 30 } }));
    cy.mount(<BedTest store={store} />);

    cy.get('[data-cell-id="text1"]').should('have.attr', 'transform', 'translate(50, 50)');
    cy.get('[data-cell-id="text1"] foreignObject')
      .should('have.attr', 'width', '100')
      .should('have.attr', 'height', '30')
      .should('have.text', 'Hello');
  });
});
