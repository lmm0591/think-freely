import { useSelector } from 'react-redux';
import { Point } from '../model/Point';
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

export const useLinePoints = (line?: DrawingCellData, inCanvasLayer = true) => {
  const { map, translate, scale } = useSelector((state: RootState) => state.cell);

  if (line?.type === undefined) {
    return [];
  }

  const points = [];
  if (line.source) {
    const point = getConnectorPoint(map, line.source.id, line?.source.direction);
    point && points.push(point);
  }

  if (inCanvasLayer) {
    points.push(...(line.points || []));
  } else {
    const linePt = line.points?.map((point) =>
      Point.from(point)
        .translateByPoint(translate)
        .scale(1 / scale),
    );
    points.push(...(linePt || []));
  }

  if (line.target) {
    const point = getConnectorPoint(map, line.target.id, line?.target.direction);
    point && points.push(point);
  }

  return points;
};
