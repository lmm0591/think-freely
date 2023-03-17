import { memo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const Text = memo(({ cellId }: { cellId: string }) => {
  const textCell = useSelector((state: RootState) => state.cell.map[cellId]);
  if (textCell?.geometry === undefined) {
    return <></>;
  }

  return (
    <g className="mx-shape" data-cell-id={textCell.id} transform={`translate(${textCell.geometry.x}, ${textCell.geometry.y})`}>
      <foreignObject
        pointerEvents="none"
        style={{ userSelect: 'none', wordBreak: 'break-all' }}
        width={textCell.geometry.width}
        height={textCell.geometry.height}
      >
        <div style={{ color: textCell.style.fontColor }}>{textCell.text}</div>
      </foreignObject>
    </g>
  );
});
