import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDND } from '../../hook/useDND';
import { Point } from '../../model/Point';
import { Rectangle } from '../../model/Rectangle';
import { RootState } from '../../store';
import { CellActions } from '../../store/CellSlice';
import { CellData, PointerResizerType, RectangleData } from '../../store/type/Cell';

export const SelectionLineResizer = ({ pointIndex, line, type }: { pointIndex?: number; line: CellData; type: PointerResizerType }) => {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const { points, source, id: lineId } = line;
  const { translate, scale, map } = useSelector((state: RootState) => state.cell);
  useDND(ref, {
    dragStartHandler: () => {
      dispatch(CellActions.editingCell(line.id));
    },
    dragMovingHandler: ({ mouseMovePoint, isFirstMoving }) => {
      if (points === undefined) {
        return;
      }
      const addPoint = mouseMovePoint
        .translateByPoint(translate)
        .scale(1 / scale)
        .toData();

      if (type === 'source' || type === 'target') {
        const newPoints = isFirstMoving ? points : [...points].slice(1);
        dispatch(CellActions.resizeLine({ id: lineId, points: [addPoint, ...newPoints] }));
        return;
      }
      if (type === 'point' && ref.current) {
        const newPoints = points.map((point, index) => (pointIndex === index ? addPoint : { ...point }));
        dispatch(CellActions.resizeLine({ id: lineId, points: newPoints, source: line.source }));
      }
    },
    dragEndHandler: () => {
      dispatch(CellActions.finishLineResize({ pointerResizerType: type }));
    },
  });

  let point;
  if (points && pointIndex !== undefined) {
    point = Point.from(points[pointIndex]).scale(scale).offsetByPoint(translate);
  } else if (source && map[source.id].geometry) {
    point = Rectangle.from(map[source.id].geometry as RectangleData).getPointByDirection(source.direction);
  }

  return (
    <ellipse
      ref={ref}
      data-resizer-line
      data-point-index={pointIndex}
      data-point-source={type === 'source' ? 'true' : undefined}
      data-point-target={type === 'target' ? 'true' : undefined}
      style={{ display: point ? 'block' : 'none' }}
      cx={point?.x}
      cy={point?.y}
      rx="5"
      ry="5"
      fill="#fff"
      stroke="#d7d7d8"
      pointerEvents="all"
    ></ellipse>
  );
};
