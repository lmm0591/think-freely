import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { AddPointer } from './AddPointer';
import { SelectionLineResizer } from './SelectionLineResizer';

export const SelectionLine = () => {
  const selectedLine = useSelector((state: RootState) => {
    const { selectedCellIds, map } = state.cell;
    if (selectedCellIds.length === 1 && map[selectedCellIds[0]]?.type === 'LINE') {
      return map[selectedCellIds[0]];
    }
  });
  const points = selectedLine?.points;
  if (points) {
    return (
      <g className="mx-line-selection-box">
        {points.map((_, index) => (
          <SelectionLineResizer key={index} points={points} pointIndex={index} lineId={selectedLine.id}></SelectionLineResizer>
        ))}
        {points.map((_, index) => {
          const isLastPoint = index === points.length - 1;
          if (!isLastPoint) {
            return <AddPointer key={index} points={points} pointIndex={index} lineId={selectedLine.id}></AddPointer>;
          }
        })}
      </g>
    );
  }
  return <></>;
};
