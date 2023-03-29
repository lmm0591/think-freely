import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDND } from '../../hook/useDND';
import { Point } from '../../model/Point';
import { Rectangle } from '../../model/Rectangle';
import { RootState } from '../../store';
import { CellActions } from '../../store/CellSlice';
import { ConnectCellType, PointData, RectangleData } from '../../store/type/Cell';

export const SelectionLineResizer = ({
  lineId,
  points,
  pointIndex,
  source,
}: {
  lineId: string;
  pointIndex?: number;
  points?: PointData[];
  source?: ConnectCellType;
}) => {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const { translate, scale, map } = useSelector((state: RootState) => state.cell);

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

  let point;
  if (points && pointIndex !== undefined) {
    point = Point.from(points[pointIndex]).scale(scale).offsetByPoint(translate);
  } else if (source && map[source.id].geometry) {
    point = Rectangle.from(map[source.id].geometry as RectangleData).getPointByDirection(source.direction);
  }

  if (!point) {
    return <></>;
  }

  return (
    <ellipse
      ref={ref}
      data-resizer-line
      data-point-index={pointIndex}
      data-point-source
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
