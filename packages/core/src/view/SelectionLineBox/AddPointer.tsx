import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDND } from '../../hook/useDND';
import { Line } from '../../model/Line';
import { Point } from '../../model/Point';
import { RootState } from '../../store';
import { CellActions } from '../../store/CellSlice';
import { PointData } from '../../store/type/Cell';

export const AddPointer = ({ points, pointIndex, lineId }: { pointIndex: number; points: PointData[]; lineId: string }) => {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const { translate, scale } = useSelector((state: RootState) => state.cell);
  const midpoint = new Line(Point.from(points[pointIndex]), Point.from(points[pointIndex + 1]))
    .getMidpoint()
    .scale(scale)
    .offsetByPoint(translate);

  useDND(ref, {
    dragMovingHandler: ({ mouseMovePoint, isFirstMoving, mouseRelativePoint }) => {
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
