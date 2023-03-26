import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export const DrawingLine = () => {
  const drawingLine = useSelector((state: RootState) => state.cell.drawing.shape);

  if (drawingLine?.type === undefined) {
    return <></>;
  }

  return (
    <g data-drawing-line>
      <polyline
        points={drawingLine.points?.map((point) => `${point.x},${point.y}`).join(' ')}
        style={{
          stroke: 'blue',
          strokeWidth: 1,
          pointerEvents: 'none',
        }}
      />
    </g>
  );
};
