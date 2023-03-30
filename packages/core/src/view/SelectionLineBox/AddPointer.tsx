import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDND } from '../../hook/useDND';
import { Line } from '../../model/Line';
import { Point } from '../../model/Point';
import { Rectangle } from '../../model/Rectangle';
import { RootState } from '../../store';
import { CellActions } from '../../store/CellSlice';
import { ConnectCellType, PointData, RectangleData } from '../../store/type/Cell';

export const AddPointer = ({
  lineId,
  points,
  pointIndex,
  source,
}: {
  lineId: string;
  pointIndex?: number;
  points: PointData[];
  source?: ConnectCellType;
}) => {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const { translate, scale, map } = useSelector((state: RootState) => state.cell);

  useDND(ref, {
    dragMovingHandler: ({ mouseMovePoint, isFirstMoving }) => {
      if (pointIndex === undefined) {
        return;
      }
      let newPoints: PointData[] = [];
      mouseMovePoint.translateByPoint(translate).scale(1 / scale);
      if (isFirstMoving) {
        newPoints = points.flatMap((point, index) => (pointIndex === index ? [{ ...point }, { ...mouseMovePoint }] : { ...point }));
      } else {
        newPoints = points.flatMap((point, index) => (pointIndex + 1 === index ? { ...mouseMovePoint } : { ...point }));
      }
      dispatch(CellActions.resizeLine({ id: lineId, points: newPoints }));
    },
  });

  let midpoint = new Point(0, 0);
  if (pointIndex !== undefined) {
    midpoint = new Line(Point.from(points[pointIndex]), Point.from(points[pointIndex + 1])).getMidpoint();
  } else if (source && map[source.id].geometry) {
    const firstPoint = Rectangle.from(map[source.id].geometry as RectangleData).getPointByDirection(source.direction);
    midpoint = new Line(Point.from(firstPoint), Point.from(points[0])).getMidpoint();
  }

  midpoint = midpoint.scale(scale).offsetByPoint(translate);

  return (
    <ellipse
      ref={ref}
      data-add-pointer
      cx={midpoint.x}
      cy={midpoint.y}
      rx="5"
      ry="5"
      fill="#84a8eb"
      stroke="#fff"
      strokeWidth="2"
    ></ellipse>
  );
};
