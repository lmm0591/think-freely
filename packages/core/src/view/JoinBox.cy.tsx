import { Provider } from 'react-redux';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { Board } from './Board';
import { CellActions, CellReduce } from '../store/CellSlice';
import { configureStore, Store } from '@reduxjs/toolkit';

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

  it('移动线条的开始位置到便利贴上，将显示被连接框', () => {
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
    cy.get('[data-point-index="0"]').mousedown(3, 3);
    cy.get('body').mousemove(150, 100);

    cy.get('[data-join-box]').should('exist');
  });
});
