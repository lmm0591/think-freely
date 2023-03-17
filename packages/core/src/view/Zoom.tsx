import { useEventListener } from 'ahooks';
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { CellActions } from '../store/CellSlice';

export const Zoom = memo(() => {
  const dispatch = useDispatch();
  const { translate, scale } = useSelector((state: RootState) => state.cell);

  useEventListener(
    'wheel',
    (event) => {
      event.stopPropagation();
      event.preventDefault();
      if (event.metaKey || event.ctrlKey) {
        dispatch(CellActions.scale({ scale: scale * (event.deltaY < 0 ? 1.25 : 0.8), basePoint: { x: event.clientX, y: event.clientY } }));
      } else {
        let x = translate.x;
        let y = translate.y;
        x = translate.x - event.deltaX;
        y = translate.y - event.deltaY;
        dispatch(CellActions.translate({ x, y }));
      }
    },
    { passive: false },
  );
  return <></>;
});
