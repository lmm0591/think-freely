import { Store, configureStore } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { Provider } from 'react-redux';
import { Board } from '../../view/Board';
import { CellActions, CellReduce } from '../../store/CellSlice';
import { RootState } from '../../store';

const BedTest = ({ store }: { store: Store<unknown> }) => {
  return (
    <Provider store={store}>
      <Board></Board>
    </Provider>
  );
};

describe('测试全选快捷键元素', () => {
  let store: ToolkitStore;
  beforeEach(() => {
    store = configureStore({ reducer: { cell: CellReduce } });
    store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
    store.dispatch(
      CellActions.addLine({
        id: 'line1',
        points: [
          { x: 10, y: 10 },
          { x: 100, y: 10 },
        ],
      }),
    );
    cy.mount(<BedTest store={store} />);
  });

  it('按下 Ctrl + a 键全选元素', () => {
    cy.get('body')
      .type('{ctrl}a')
      .then(() => {
        chai.expect((store.getState() as RootState).cell.selectedCellIds).eql(['cell1', 'line1']);
      });
  });

  it('按下 Meta + a 键全选元素', () => {
    cy.get('body')
      .type('{cmd}a')
      .then(() => {
        chai.expect((store.getState() as RootState).cell.selectedCellIds).eql(['cell1', 'line1']);
      });
  });

  it('当输入文字时不触发全选', () => {
    store.dispatch(CellActions.editingCell({ id: 'cell1' }));
    cy.get('body')
      .type('{cmd}a')
      .then(() => {
        chai.expect((store.getState() as RootState).cell.selectedCellIds).eql([]);
      });
  });
});
