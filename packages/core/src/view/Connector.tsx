import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useGetSelectedCellGeometry } from '../store/CellSelector';
import { CellType } from '../store/type/Cell';

const ableConnect = (type: CellType) => {
  const ableConnectTypes: CellType[] = ['STICKY', 'TEXT'];
  return ableConnectTypes.includes(type);
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
        <ellipse cx={topPoint.x} cy={topPoint.y} rx="3" ry="3" fill="#576ee0" opacity="0.5"></ellipse>
        <ellipse cx={rightPoint.x} cy={rightPoint.y} rx="3" ry="3" fill="#576ee0" opacity="0.5"></ellipse>
        <ellipse cx={bottomPoint.x} cy={bottomPoint.y} rx="3" ry="3" fill="#576ee0" opacity="0.5"></ellipse>
        <ellipse cx={leftPoint.x} cy={leftPoint.y} rx="3" ry="3" fill="#576ee0" opacity="0.5"></ellipse>
      </g>
    );
  }
  return <></>;
};
