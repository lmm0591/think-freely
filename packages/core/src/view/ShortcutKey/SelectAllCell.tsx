import { useKeyPress } from 'ahooks';
import { useDispatch, useSelector } from 'react-redux';
import { CellActions } from '../../store/CellSlice';
import { RootState } from '../../store';

export const useSelectAllCell = () => {
  const dispatch = useDispatch();
  const cellMap = useSelector((state: RootState) => state.cell.map);
  useKeyPress(['meta.a', 'ctrl.a'], () => {
    dispatch(CellActions.selectDisplayCells(Object.keys(cellMap)));
  });
};
