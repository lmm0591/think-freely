import { useKeyPress } from 'ahooks';
import { useDispatch, useStore } from 'react-redux';
import { CellActions } from '../../store/CellSlice';
import { RootState } from '../../store';

export const useDeleteCell = () => {
  const dispatch = useDispatch();
  const store = useStore();
  useKeyPress(['backspace', 'delete'], () => {
    const { selectedCellIds } = (store.getState() as RootState).cell;
    dispatch(CellActions.deleteCells({ cellIds: selectedCellIds }));
  });
};
