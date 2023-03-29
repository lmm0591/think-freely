import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 } from 'uuid';
import { useDND } from '../hook/useDND';
import { RootState } from '../store';
import { useGetSelectedCellGeometry } from '../store/CellSelector';
import { CellActions } from '../store/CellSlice';
import { CellType, PointData } from '../store/type/Cell';
import { DirectionFour } from './type/SelectionBox';

const ableConnect = (type: CellType) => {
  const ableConnectTypes: CellType[] = ['STICKY', 'TEXT'];
  return ableConnectTypes.includes(type);
};

export const ConnectPoint = ({ point, direction, id }: { point: PointData; direction: DirectionFour; id: string }) => {
  const ref = useRef(null);
  const dispatch = useDispatch();
  const { translate, scale } = useSelector((state: RootState) => state.cell);
  useDND(ref, {
    dragMovingHandler: ({ mouseMovePoint }) => {
      dispatch(CellActions.startDrawLine({ source: { direction, id }, points: [mouseMovePoint] }));
    },
    dragEndHandler: ({ mouseMovePoint }) => {
      dispatch(CellActions.endDraw());
      dispatch(
        CellActions.addLine({ id: v4(), source: { direction, id }, points: [mouseMovePoint.translateByPoint(translate).scale(1 / scale)] }),
      );
    },
  });
  return <ellipse ref={ref} cx={point.x} cy={point.y} rx="3" ry="3" fill="#576ee0" opacity="0.5"></ellipse>;
};

export const Connector = () => {
  const { translate, scale, selectedCellIds, map } = useSelector((state: RootState) => state.cell);
  let cellRectangle = useGetSelectedCellGeometry()?.scale(scale, scale, { x: 0, y: 0 }).offsetByPoint(translate);

  const onlyOneCell = selectedCellIds.length === 1 && ableConnect(map[selectedCellIds[0]].type);
  if (onlyOneCell && cellRectangle) {
    const selectedId = selectedCellIds[0];

    cellRectangle = cellRectangle.grow(14);
    const topPoint = cellRectangle.getPointTop();
    const rightPoint = cellRectangle.getPointRight();
    const bottomPoint = cellRectangle.getPointBottom();
    const leftPoint = cellRectangle.getPointLeft();
    return (
      <g data-connector>
        <ConnectPoint point={topPoint} direction="N" id={selectedId}></ConnectPoint>
        <ConnectPoint point={rightPoint} direction="E" id={selectedId}></ConnectPoint>
        <ConnectPoint point={bottomPoint} direction="S" id={selectedId}></ConnectPoint>
        <ConnectPoint point={leftPoint} direction="W" id={selectedId}></ConnectPoint>
      </g>
    );
  }
  return <></>;
};
