import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDND } from '../../hook/useDND';
import { Point } from '../../model/Point';
import { RootState } from '../../store';
import { CellActions } from '../../store/CellSlice';
import { PointData } from '../../store/type/Cell';

export const SelectionLineResizer = ({ points, pointIndex, lineId }: { pointIndex: number; points: PointData[]; lineId: string }) => {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const { translate, scale } = useSelector((state: RootState) => state.cell);

  useDND(ref, {
    dragMovingHandler: ({ mouseMovePoint }) => {
      if (points && ref.current) {
        const pointIndex = Number((ref.current as SVGEllipseElement).getAttribute('data-point-index')) || 0;
        const newPoints = points.map((point, index) =>
          pointIndex === index ? { ...mouseMovePoint.translateByPoint(translate).scale(1 / scale) } : { ...point },
        );
        dispatch(CellActions.resizeLine({ id: lineId, points: newPoints }));
      }
    },
  });
  const point = Point.from(points[pointIndex]).scale(scale).offsetByPoint(translate);
  return (
    <ellipse
      ref={ref}
      data-resizer-line
      data-point-index={pointIndex}
      cx={point.x}
      cy={point.y}
      rx="5"
      ry="5"
      fill="#fff"
      stroke="#d7d7d8"
      pointerEvents="all"
    ></ellipse>
  );
};
