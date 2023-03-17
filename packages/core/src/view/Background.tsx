import { forwardRef, LegacyRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { CellActions } from '../store/CellSlice';

const CELL_HEIGHT = 100;
const CELL_WIDTH = 100;

export const Background = forwardRef((prop, ref: LegacyRef<SVGGElement>) => {
  const dispatch = useDispatch();
  const isOperateRubberBand = useSelector((state: RootState) => state.cell.operate.rubberBand);
  const { translate, scale } = useSelector((state: RootState) => state.cell);

  const cellWidth = CELL_WIDTH * scale;
  const cellHeight = CELL_HEIGHT * scale;
  const x = (translate.x % cellWidth) - cellWidth;
  const y = (translate.y % cellHeight) - cellHeight;
  return (
    <g
      className="mx-grid-background"
      style={{ pointerEvents: isOperateRubberBand ? 'none' : 'auto' }}
      transform={`translate(${x}, ${y})`}
      ref={ref}
      onClick={() => {
        dispatch(CellActions.clearSelected());
      }}
    >
      <defs>
        <pattern id="mx-graph-pattern" width={cellWidth} height={cellHeight} patternUnits="userSpaceOnUse">
          <path d={`M ${cellWidth} 0 L 0 0 0 ${cellHeight}`} fill="none" stroke="#e0e0e0" strokeWidth="1"></path>
        </pattern>
      </defs>
      <rect width="200%" height="200%" style={{ fill: 'rgb(246, 246, 249)' }}></rect>
      <rect width="200%" height="200%" fill="url(#mx-graph-pattern)"></rect>
    </g>
  );
});
