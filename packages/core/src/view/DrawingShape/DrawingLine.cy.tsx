import { configureStore, Store } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { Provider } from 'react-redux';
import { CellReduce } from '../../store/CellSlice';
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
});
