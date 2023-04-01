import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDND } from '../../hook/useDND';
import { Line } from '../../model/Line';
import { Point } from '../../model/Point';
import { Rectangle } from '../../model/Rectangle';
import { RootState } from '../../store';
import { CellActions } from '../../store/CellSlice';
import { CellData, LineResizerType, PointData } from '../../store/type/Cell';

export const AddPointer = ({ pointIndex, line, type }: { pointIndex?: number; line: CellData; type: LineResizerType }) => {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const { translate, scale } = useSelector((state: RootState) => state.cell);
  const { points, id: lineId } = line;

  useDND(ref, {
    dragMovingHandler: ({ mouseMovePoint, isFirstMoving }) => {
      const addPoint = mouseMovePoint
        .translateByPoint(translate)
        .scale(1 / scale)
        .toData();
      let newPoints: PointData[] = [];
      if (points === undefined) {
        dispatch(CellActions.resizeLine({ id: lineId, points: [addPoint], source: line.source, target: line.target }));
        return;
      }

      if (pointIndex === undefined) {
        newPoints = isFirstMoving ? points : [...points].slice(1);
        dispatch(CellActions.resizeLine({ id: lineId, points: [addPoint, ...newPoints], source: line.source, target: line.target }));
        return;
      } else {
        if (isFirstMoving) {
          newPoints = points.flatMap((point, index) => (pointIndex === index ? [{ ...point }, addPoint] : { ...point }));
        } else {
          newPoints = points.flatMap((point, index) => (pointIndex + 1 === index ? addPoint : { ...point }));
        }
        dispatch(CellActions.resizeLine({ id: lineId, points: newPoints, source: line.source, target: line.target }));
      }
    },
  });

  const point = useGetPoint(type, line, pointIndex);

  return (
    <ellipse
      ref={ref}
      data-add-pointer
      style={{ display: point ? 'block' : 'none' }}
      cx={point?.x}
      cy={point?.y}
      rx="5"
      ry="5"
      fill="#84a8eb"
      stroke="#fff"
      strokeWidth="2"
    ></ellipse>
  );
};

function useGetPoint(type: LineResizerType, line: CellData, pointIndex?: number) {
  const { points, source, target } = line;

  const { translate, scale, map } = useSelector((state: RootState) => state.cell);

  let midpoint: Point | undefined = undefined;
  let sourceGeometry = source && map[source.id].geometry;
  let targetGeometry = target && map[target.id].geometry;
  const firstPoint = source && sourceGeometry && Rectangle.from(sourceGeometry).getPointByDirection(source.direction);
  const lastPoint = target && targetGeometry && Rectangle.from(targetGeometry).getPointByDirection(target.direction);
  if (type === 'point' && points && pointIndex !== undefined) {
    midpoint = new Line(Point.from(points[pointIndex]), Point.from(points[pointIndex + 1])).getMidpoint();
  } else if (type === 'source' && points === undefined && firstPoint && lastPoint) {
    midpoint = new Line(Point.from(firstPoint), Point.from(lastPoint)).getMidpoint();
  } else if (type === 'source' && points?.length && firstPoint) {
    midpoint = new Line(Point.from(firstPoint), Point.from(points[0])).getMidpoint();
  } else if (type === 'target' && points?.length && lastPoint) {
    midpoint = new Line(Point.from(points[0]), Point.from(lastPoint)).getMidpoint();
  }

  return midpoint?.scale(scale)?.offsetByPoint(translate);
}
