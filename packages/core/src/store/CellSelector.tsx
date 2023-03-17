import { useSelector } from 'react-redux';
import { Rectangle } from '../model/Rectangle';
import { RootState } from '.';
import { CellData } from './type/Cell';

export function getSelectedCellGeometry(selectedCellIds: string[], map: Record<string, CellData>) {
  const selectedRects = selectedCellIds.flatMap((id) => {
    const cell = map[id];
    if (cell?.geometry) {
      return Rectangle.from(cell.geometry);
    } else if (cell?.points && cell.points.length >= 2) {
      return Rectangle.fromPoints(cell.points) as Rectangle;
    }
    return [];
  });
  if (selectedRects.length === 0) {
    return;
  }
  return Rectangle.merge(selectedRects);
}

export function useGetSelectedCellGeometry() {
  return useSelector((state: RootState) => {
    const { selectedCellIds, map } = state.cell;
    return getSelectedCellGeometry(selectedCellIds, map);
  });
}
