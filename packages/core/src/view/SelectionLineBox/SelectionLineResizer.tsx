import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDND } from '../../hook/useDND';
import { Point } from '../../model/Point';
import { Rectangle } from '../../model/Rectangle';
import { RootState } from '../../store';
import { CellActions } from '../../store/CellSlice';
import { CellData, LineResizerType, RectangleData } from '../../store/type/Cell';

export const SelectionLineResizer = ({ pointIndex, line, type }: { pointIndex?: number; line: CellData; type: LineResizerType }) => {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const { points, source, target, id: lineId } = line;
  const { translate, scale, map } = useSelector((state: RootState) => state.cell);
  useDND(ref, {
    dragStartHandler: () => {
      let editLineResizerType = type;
      if (type === 'point' && pointIndex !== undefined) {
        source === undefined && pointIndex === 0 && (editLineResizerType = 'source');
        target === undefined && pointIndex + 1 === points?.length && (editLineResizerType = 'target');
      }
      dispatch(CellActions.editingCell({ id: line.id, editLineResizerType }));
    },
    dragMovingHandler: ({ mouseMovePoint, isFirstMoving }) => {
      if (points === undefined) {
        return;
      }
      const addPoint = mouseMovePoint
        .translateByPoint(translate)
        .scale(1 / scale)
        .toData();

      if (type === 'source') {
        const newPoints = isFirstMoving ? points : [...points].slice(1);
        dispatch(CellActions.resizeLine({ id: lineId, points: [addPoint, ...newPoints], target: line.target }));
        return;
      }
      if (type === 'target') {
        const newPoints = isFirstMoving ? points : [...points].slice(0, points.length - 1);
        dispatch(CellActions.resizeLine({ id: lineId, points: [...newPoints, addPoint], source: line.source }));
        return;
      }

      if (type === 'point' && ref.current) {
        const newPoints = points.map((point, index) => (pointIndex === index ? addPoint : { ...point }));
        dispatch(CellActions.resizeLine({ id: lineId, points: newPoints, source: line.source, target: line.target }));
      }
    },
    dragEndHandler: () => {
      dispatch(CellActions.finishLineResize({}));
    },
  });

  let point;
  if (type === 'point' && points && pointIndex !== undefined) {
    point = Point.from(points[pointIndex]).scale(scale).offsetByPoint(translate);
  } else if (type === 'source' && source && map[source.id].geometry) {
    point = Rectangle.from(map[source.id].geometry as RectangleData)
      .getPointByDirection(source.direction)
      .scale(scale)
      .offsetByPoint(translate);
  } else if (type === 'target' && target && map[target.id].geometry) {
    point = Rectangle.from(map[target.id].geometry as RectangleData)
      .getPointByDirection(target.direction)
      .scale(scale)
      .offsetByPoint(translate);
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
