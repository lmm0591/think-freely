import { Store, configureStore } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { Provider } from 'react-redux';
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

describe('测试删除元素', () => {
  let store: ToolkitStore;
  beforeEach(() => {
    store = configureStore({ reducer: { cell: CellReduce } });
  });

  it('按下 Back 键删除元素', () => {
    store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
    cy.mount(<BedTest store={store} />);

    cy.get('body')
      .click(80, 80)
      .type('{backspace}')
      .then(() => {
        chai.expect((store.getState() as RootState).cell.map['cell1']).to.undefined;
        chai.expect((store.getState() as RootState).cell.selectedCellIds).length(0);
      });
  });

  it('按下 Delete 键删除元素', () => {
    store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
    cy.mount(<BedTest store={store} />);

    cy.get('body')
      .click(80, 80)
      .type('{del}')
      .then(() => {
        chai.expect((store.getState() as RootState).cell.map['cell1']).to.undefined;
        chai.expect((store.getState() as RootState).cell.selectedCellIds).length(0);
      });
  });
});
