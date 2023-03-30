import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDND } from '../../hook/useDND';
import { Point } from '../../model/Point';
import { Rectangle } from '../../model/Rectangle';
import { RootState } from '../../store';
import { CellActions } from '../../store/CellSlice';
import { CellData, RectangleData } from '../../store/type/Cell';

export const SelectionLineResizer = ({ pointIndex, line }: { pointIndex?: number; line: CellData }) => {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const { points, source, id: lineId } = line;
  const { translate, scale, map } = useSelector((state: RootState) => state.cell);

  useDND(ref, {
    dragMovingHandler: ({ mouseMovePoint, isFirstMoving }) => {
      const firstPoint = mouseMovePoint
        .translateByPoint(translate)
        .scale(1 / scale)
        .toData();
      if (points && pointIndex === undefined) {
        const newPoints = isFirstMoving ? points : [...points].slice(1);
        dispatch(CellActions.resizeLine({ id: lineId, points: [firstPoint, ...newPoints] }));
        return;
      }
      if (points && ref.current) {
        const newPoints = points.map((point, index) => (pointIndex === index ? firstPoint : { ...point }));
        dispatch(CellActions.resizeLine({ id: lineId, points: newPoints, source: line.source }));
      }
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
      data-point-source={source}
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
