import { useKeyPress } from 'ahooks';
import { useDispatch } from 'react-redux';
import { HistoryActions } from '../../store/HistorySlice';

export const useUndo = () => {
  const dispatch = useDispatch();

  useKeyPress(['meta.z', 'ctrl.z'], (event) => {
    if (event.shiftKey) {
      dispatch(HistoryActions.redo({ historyMate: { ignore: true } }));
    } else {
      dispatch(HistoryActions.undo({ historyMate: { ignore: true } }));
    }
  });
};
