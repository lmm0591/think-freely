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

describe('测试组合', () => {
  let store: ToolkitStore;
  beforeEach(() => {
    store = configureStore({ reducer: { cell: CellReduce } });
  });

  it('成功组合两个元素后，界面渲染一个组合节点', () => {
    store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
    store.dispatch(CellActions.addSticky({ id: 'cell2', geometry: { x: 150, y: 150, width: 100, height: 100 } }));
    store.dispatch(CellActions.createGroup({ id: 'group1', children: ['cell1', 'cell2'] }));
    cy.mount(<BedTest store={store} />);

    cy.get('[data-cell-type="GROUP"]').should('have.attr', 'transform', 'translate(50, 50)');
  });

  it('成功组合两个元素后，组合内的元素位置会发生相对位移', () => {
    store.dispatch(CellActions.addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
    store.dispatch(CellActions.addSticky({ id: 'cell2', geometry: { x: 150, y: 150, width: 100, height: 100 } }));
    store.dispatch(CellActions.createGroup({ id: 'group1', children: ['cell1', 'cell2'] }));
    cy.mount(<BedTest store={store} />);

    cy.get('[data-cell-id="cell1"]').should('have.attr', 'transform', 'translate(50, 50)');
    cy.get('[data-cell-id="cell2"]').should('have.attr', 'transform', 'translate(150, 150)');
  });
});
