import { Provider } from 'react-redux';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { Store } from '@reduxjs/toolkit';
import { Board } from '../../view/Board';
import { CellActions } from '../../store/CellSlice';
import { CreateStore } from '../../store/CreateStore';

const BedTest = ({ store }: { store: Store<unknown> }) => {
  return (
    <Provider store={store}>
      <Board></Board>
    </Provider>
  );
};

describe('测试 Undo & Redo 功能', () => {
  let store: ToolkitStore;
  beforeEach(() => {
    store = CreateStore();
  });

  it('按下 Ctrl+Z, 撤销操作', () => {
    store.dispatch(CellActions.addSticky({ id: 'sticky1', geometry: { x: 0, y: 0, width: 100, height: 100 } }));
    cy.mount(<BedTest store={store} />);

    cy.get('body').type('{ctrl}z');

    cy.get('[data-cell-id="sticky1"]').should('not.exist');
  });

  it('按下 Ctrl+SHIFT+Z, 重做操作', () => {
    store.dispatch(CellActions.addSticky({ id: 'sticky1', geometry: { x: 0, y: 0, width: 100, height: 100 } }));
    cy.mount(<BedTest store={store} />);
    cy.get('body').type('{ctrl}z');

    cy.get('body').type('{ctrl}{shift}z');

    cy.get('[data-cell-id="sticky1"]').should('exist');
  });
});
