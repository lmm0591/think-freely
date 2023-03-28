import { memo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDND } from '../hook/useDND';
import { RootState } from '../store';
import { CellActions } from '../store/CellSlice';
import { Rectangle } from '../model/Rectangle';
import { DirectionFour } from './type/SelectionBox';
import { CellData } from '../store/type/Cell';
import { useLinePoints } from '../hook/useLinePoints';

function getConnectorPoint(cellStore: Record<string, CellData>, cellId: string, direction: DirectionFour) {
  const geometry = cellStore[cellId]?.geometry;
  if (geometry) {
    return Rectangle.from(geometry).getPointByDirection(direction);
  }
}

export const Line = memo(({ cellId }: { cellId: string }) => {
  const dispatch = useDispatch();
  const lineCell = useSelector((state: RootState) => state.cell.map[cellId]);
  const { translate, scale } = useSelector((state: RootState) => state.cell);

  const ref = useRef(null);
  useDND(ref, {
    dragMovingHandler: ({ mouseMovePoint, mouseRelativePoint }) => {
      dispatch(
        CellActions.moveCell({
          id: cellId,
          point: mouseMovePoint
            .translateByPoint(translate)
            .scale(1 / scale)
            .translateByPoint(mouseRelativePoint.scale(1 / scale))
            .toData(),
        }),
      );
    },
  });
  const points = useLinePoints(lineCell);

  if (points.length < 2) {
    return <></>;
  }
  const endArrow = lineCell.style.endArrow && `url(#think-freely-${lineCell.style.endArrow})`;
  const startArrow = lineCell.style.startArrow && `url(#think-freely-${lineCell.style.startArrow})`;

  return (
    <g className="mx-shape" data-shape-line data-cell-id={lineCell.id}>
      <polyline
        points={points.map((point) => `${point.x},${point.y}`).join(' ')}
        markerEnd={endArrow}
        markerStart={startArrow}
        style={{
          fill: 'none',
          stroke: 'black',
          strokeWidth: 1,
          pointerEvents: 'none',
        }}
      />
      <polyline
        ref={ref}
        points={points.map((point) => `${point.x},${point.y}`).join(' ')}
        markerEnd={endArrow}
        markerStart={startArrow}
        style={{
          opacity: 0,
          stroke: 'black',
          strokeWidth: 8,
          fill: 'none',
        }}
        onClick={() => {
          dispatch(CellActions.selectDisplayCells([cellId]));
        }}
      />
    </g>
  );
});
