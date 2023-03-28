import { useSelector } from 'react-redux';
import { Rectangle } from '../model/Rectangle';
import { RootState } from '../store';
import { CellData, DrawingCellData } from '../store/type/Cell';
import { DirectionFour } from '../view/type/SelectionBox';

function getConnectorPoint(cellStore: Record<string, CellData>, cellId: string, direction: DirectionFour) {
  const geometry = cellStore[cellId]?.geometry;
  if (geometry) {
    return Rectangle.from(geometry).getPointByDirection(direction);
  }
}

export const useLinePoints = (line?: DrawingCellData) => {
  const { map } = useSelector((state: RootState) => state.cell);
  if (line?.type === undefined) {
    return [];
  }

  const points = [];
  if (line.source) {
    const point = getConnectorPoint(map, line.source.id, line?.source.direction);
    point && points.push(point);
  }

  points.push(...(line.points || []));

  if (line.target) {
    const point = getConnectorPoint(map, line.target.id, line?.target.direction);
    point && points.push(point);
  }
  return points;
};
