import { useRef } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { useDND } from '../hook/useDND';
import { Point } from '../model/Point';
import { RootState } from '../store';
import { useGetSelectedCellGeometry } from '../store/CellSelector';
import { CellActions } from '../store/CellSlice';
import { CellData } from '../store/type/Cell';
import { DirectionFour } from './type/SelectionBox';

const POINT_SIZE = 5;
const MINI_WIDTH = 70;
const MINI_HEIGHT = 70;
function resizePoint(point: Point, cursor: string) {
  return (
    <ellipse
      className="mx-resizer"
      transform={`translate(${point.x}, ${point.y})`}
      style={{ cursor }}
      cx={POINT_SIZE}
      cy={POINT_SIZE}
      rx={POINT_SIZE}
      ry={POINT_SIZE}
      fill="#fff"
      stroke="#d7d7d8"
      pointerEvents="all"
    ></ellipse>
  );
}

function ResizeLine({
  beginPoint,
  endPoint,
  cursor,
  direction,
}: {
  beginPoint: Point;
  endPoint: Point;
  cursor: string;
  direction: DirectionFour;
}) {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const store = useStore();
  const scale = (store.getState() as RootState).cell.scale;
  const oldSelectedCells = useRef<CellData[]>([]);
  const selectedCellGeometry = useGetSelectedCellGeometry();
  const oldCellRect = useRef(selectedCellGeometry);
  useDND(ref, {
    dragStartHandler: () => {
      oldCellRect.current = selectedCellGeometry;
      const { selectedCellIds, map } = (store.getState() as RootState).cell;
      const cells = selectedCellIds
        .map((id) => map[id])
        .filter(Boolean)
        .flatMap((cell) => (cell.type === 'GROUP' ? [...cell.children.map((id) => map[id]), cell] : cell));
      oldSelectedCells.current = cells;
    },
    dragMovingHandler: ({ movePoint }) => {
      if (oldCellRect) {
        movePoint.scale(1 / scale);
        if (direction === 'E' || direction === 'W') {
          const vector = direction === 'W' ? -movePoint.x : movePoint.x;
          dispatch(CellActions.resizeCells({ orgCells: oldSelectedCells.current, vector, direction }));
        } else if (direction === 'N' || direction === 'S') {
          const vector = direction === 'N' ? -movePoint.y : movePoint.y;
          dispatch(CellActions.resizeCells({ orgCells: oldSelectedCells.current, vector, direction }));
        }
      }
    },
  });

  return (
    <line
      ref={ref}
      className="mx-resizer"
      data-direction={direction}
      style={{ cursor }}
      x1={beginPoint.x}
      y1={beginPoint.y}
      x2={endPoint.x}
      y2={endPoint.y}
      strokeWidth="10"
      fill="transparent"
      stroke="transparent"
      pointerEvents="all"
    ></line>
  );
}

export const SelectionBox = () => {
  const { translate, scale, selectedCellIds, map } = useSelector((state: RootState) => state.cell);
  const cellRectangle = useGetSelectedCellGeometry()?.scale(scale, scale, { x: 0, y: 0 }).offsetByPoint(translate);
  const dispatch = useDispatch();
  const moveRef = useRef(null);
  useDND(moveRef, {
    dragMovingHandler: ({ mouseRelativePoint, mouseMovePoint }) => {
      dispatch(
        CellActions.moveCellsBySelected(
          mouseMovePoint
            .clone()
            .translateByPoint(translate)
            .scale(1 / scale)
            .translateByPoint(mouseRelativePoint.scale(1 / scale))
            .toData(),
        ),
      );
    },
  });
  const onlyOneLine = selectedCellIds.length === 1 && map[selectedCellIds[0]].type === 'LINE';
  if (cellRectangle === undefined || onlyOneLine) {
    return <></>;
  }

  const pointRectangle = cellRectangle.clone().offset(-POINT_SIZE);
  return (
    <g>
      <rect
        className="mx-selection-box"
        transform={`translate(${cellRectangle.x}, ${cellRectangle.y})`}
        ref={moveRef}
        width={cellRectangle.width}
        height={cellRectangle.height}
        fill="none"
        stroke="#4e9deb"
        pointerEvents="all"
      ></rect>
      <ResizeLine beginPoint={cellRectangle.getPointA()} endPoint={cellRectangle.getPointB()} cursor="ns-resize" direction="N"></ResizeLine>
      <ResizeLine beginPoint={cellRectangle.getPointB()} endPoint={cellRectangle.getPointC()} cursor="ew-resize" direction="E"></ResizeLine>
      <ResizeLine beginPoint={cellRectangle.getPointC()} endPoint={cellRectangle.getPointD()} cursor="ns-resize" direction="S"></ResizeLine>
      <ResizeLine beginPoint={cellRectangle.getPointD()} endPoint={cellRectangle.getPointA()} cursor="ew-resize" direction="W"></ResizeLine>

      {resizePoint(pointRectangle.getPointA(), 'nwse-resize')}
      {resizePoint(pointRectangle.getPointB(), 'nesw-resize')}
      {resizePoint(pointRectangle.getPointC(), 'nwse-resize')}
      {resizePoint(pointRectangle.getPointD(), 'nesw-resize')}
    </g>
  );
};
