import { getSelectedCellGeometry } from './CellSelector';
import { CellActions, CellSlice, initialState } from './CellSlice';

const { reducer } = CellSlice;
const { addSticky, selectDisplayCells } = CellActions;

describe('测试 CellSelector', () => {
  it('当选中便利贴时，返回便利贴大小', () => {
    let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 0, y: 0, width: 100, height: 100 } }));
    store = reducer(store, selectDisplayCells(['cell1']));
    chai.expect(getSelectedCellGeometry(store.selectedCellIds, store.map)).contain({ x: 0, y: 0, width: 100, height: 100 });
  });

  it('当选中组合时，返回组合内子元素大小总各区域', () => {
    let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
    store = reducer(store, addSticky({ id: 'cell2', geometry: { x: 150, y: 150, width: 100, height: 100 } }));
    store = reducer(store, selectDisplayCells(['cell1', 'cell2']));
    chai.expect(getSelectedCellGeometry(store.selectedCellIds, store.map)).contain({ x: 50, y: 50, width: 200, height: 200 });
  });
});
