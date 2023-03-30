import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDND } from '../../hook/useDND';
import { Line } from '../../model/Line';
import { Point } from '../../model/Point';
import { Rectangle } from '../../model/Rectangle';
import { RootState } from '../../store';
import { CellActions } from '../../store/CellSlice';
import { CellData, PointData, RectangleData } from '../../store/type/Cell';

export const AddPointer = ({ pointIndex, line }: { pointIndex?: number; line: CellData }) => {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const { translate, scale, map } = useSelector((state: RootState) => state.cell);
  const { points, source, id: lineId } = line;

  useDND(ref, {
    dragMovingHandler: ({ mouseMovePoint, isFirstMoving }) => {
      const addPoint = mouseMovePoint
        .translateByPoint(translate)
        .scale(1 / scale)
        .toData();
      let newPoints: PointData[] = [];
      if (points === undefined) {
        return;
      }

      if (pointIndex === undefined) {
        newPoints = isFirstMoving ? points : [...points].slice(1);
        dispatch(CellActions.resizeLine({ id: lineId, points: [addPoint, ...newPoints], source: line.source }));
        return;
      } else {
        if (isFirstMoving) {
          newPoints = points.flatMap((point, index) => (pointIndex === index ? [{ ...point }, addPoint] : { ...point }));
        } else {
          newPoints = points.flatMap((point, index) => (pointIndex + 1 === index ? addPoint : { ...point }));
        }
        dispatch(CellActions.resizeLine({ id: lineId, points: newPoints, source: line.source }));
      }
    },
  });

  let midpoint: Point | undefined = undefined;
  if (points && pointIndex !== undefined) {
    midpoint = new Line(Point.from(points[pointIndex]), Point.from(points[pointIndex + 1])).getMidpoint();
  } else if (points && source && map[source.id].geometry) {
    const firstPoint = Rectangle.from(map[source.id].geometry as RectangleData).getPointByDirection(source.direction);
    midpoint = new Line(Point.from(firstPoint), Point.from(points[0])).getMidpoint();
  }

  midpoint = midpoint?.scale(scale)?.offsetByPoint(translate);

  return (
    <ellipse
      ref={ref}
      data-add-pointer
      style={{ display: midpoint ? 'block' : 'none' }}
      cx={midpoint?.x}
      cy={midpoint?.y}
      rx="5"
      ry="5"
      fill="#84a8eb"
      stroke="#fff"
      strokeWidth="2"
    ></ellipse>
  );
};
