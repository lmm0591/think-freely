import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

export const ConnectPoint = ({ point }: { point: PointData }) => {
  const ref = useRef(null);
  const dispatch = useDispatch();
  useDND(ref, {
    dragMovingHandler: ({ mouseMovePoint }) => {
      dispatch(CellActions.startDrawLine({ points: [point, mouseMovePoint] }));
    },
    dragEndHandler: () => {
      dispatch(CellActions.endDraw());
    },
  });
  return <ellipse ref={ref} cx={point.x} cy={point.y} rx="3" ry="3" fill="#576ee0" opacity="0.5"></ellipse>;
};

export const Connector = () => {
  const { translate, scale, selectedCellIds, map } = useSelector((state: RootState) => state.cell);
  let cellRectangle = useGetSelectedCellGeometry()?.scale(scale, scale, { x: 0, y: 0 }).offsetByPoint(translate);

  const onlyOneCell = selectedCellIds.length === 1 && ableConnect(map[selectedCellIds[0]].type);
  if (onlyOneCell && cellRectangle) {
    cellRectangle = cellRectangle.grow(14);
    const topPoint = cellRectangle.getPointTop();
    const rightPoint = cellRectangle.getPointRight();
    const bottomPoint = cellRectangle.getPointBottom();
    const leftPoint = cellRectangle.getPointLeft();
    return (
      <g data-connector>
        <ConnectPoint point={topPoint}></ConnectPoint>
        <ConnectPoint point={rightPoint}></ConnectPoint>
        <ConnectPoint point={bottomPoint}></ConnectPoint>
        <ConnectPoint point={leftPoint}></ConnectPoint>
      </g>
    );
  }
  return <></>;
};
