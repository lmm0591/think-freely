import { memo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDND } from '../hook/useDND';
import { Rectangle } from '../model/Rectangle';
import { RootState } from '../store';
import { CellActions } from '../store/CellSlice';
import { GeometryCellData } from '../store/type/Cell';

export const Group = memo(({ cellId }: { cellId: string }) => {
  const dispatch = useDispatch();
  const ref = useRef(null);
  useDND(ref, {
    dragMovingHandler: ({ mouseMovePoint, mouseRelativePoint }) => {
      dispatch(
        CellActions.moveCell({
          id: cellId,
          point: mouseMovePoint.translateByPoint(mouseRelativePoint).toData(),
        }),
      );
    },
  });

  const stateMap = useSelector((state: RootState) => state.cell.map);
  const groupCell = stateMap[cellId];
  if (groupCell === undefined) {
    return <></>;
  }

  const groupRectangle = Rectangle.merge(
    groupCell.children
      .flatMap<GeometryCellData>((id) => {
        if (stateMap[id].geometry) {
          return stateMap[id] as GeometryCellData;
        }
        return [];
      })
      .map((childCell) => Rectangle.from(childCell.geometry)),
  );

  return (
    <g
      ref={ref}
      className="mx-shape"
      data-cell-type={groupCell.type}
      data-cell-id={groupCell.id}
      transform={`translate(${groupRectangle.x}, ${groupRectangle.y})`}
    >
      <rect
        width={groupRectangle.width}
        height={groupRectangle.height}
        fill="transparent"
        stroke="none"
        pointerEvents="all"
        onClick={() => {
          dispatch(CellActions.selectGroup(cellId));
        }}
      ></rect>
    </g>
  );
});
