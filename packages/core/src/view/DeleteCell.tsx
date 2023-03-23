import { useKeyPress } from 'ahooks';
import { memo } from 'react';
import { useDispatch, useStore } from 'react-redux';
import { CellActions } from '../store/CellSlice';
import { RootState } from '../store';

export const DeleteCell = memo(() => {
  const dispatch = useDispatch();
  const store = useStore();
  useKeyPress('backspace', () => {
    const { selectedCellIds } = (store.getState() as RootState).cell;
    dispatch(CellActions.deleteCells({ cellIds: selectedCellIds }));
  });
  return <></>;
});
