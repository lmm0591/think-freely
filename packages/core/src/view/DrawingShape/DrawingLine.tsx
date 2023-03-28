import { useSelector } from 'react-redux';
import { useLinePoints } from '../../hook/useLinePoints';
import { RootState } from '../../store';

export const DrawingLine = () => {
  const drawingLine = useSelector((state: RootState) => state.cell.drawing.shape);
  const points = useLinePoints(drawingLine);

  if (drawingLine?.type === undefined) {
    return <></>;
  }

  return (
    <g data-drawing-line>
      <polyline
        points={points?.map((point) => `${point.x},${point.y}`).join(' ')}
        style={{
          stroke: 'blue',
          strokeWidth: 1,
          pointerEvents: 'none',
        }}
      />
    </g>
  );
};
