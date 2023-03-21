import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { CellActions } from '../store/CellSlice';

export const Text = memo(({ cellId }: { cellId: string }) => {
  const textCell = useSelector((state: RootState) => state.cell.map[cellId]);
  const editId = useSelector((state: RootState) => state.cell.operate.editId);

  const dispatch = useDispatch();
  if (textCell?.geometry === undefined) {
    return <></>;
  }

  return (
    <g className="mx-shape" data-cell-id={textCell.id} transform={`translate(${textCell.geometry.x}, ${textCell.geometry.y})`}>
      <foreignObject
        onClick={() => {
          dispatch(CellActions.selectDisplayCells([cellId]));
        }}
        style={{ userSelect: 'none', display: cellId === editId ? 'none' : '', wordBreak: 'break-all' }}
        width={textCell.geometry.width}
        height={textCell.geometry.height}
      >
        <div style={{ color: textCell.style.fontColor, fontSize: textCell.style.fontSize }}>{textCell.text}</div>
      </foreignObject>
    </g>
  );
});
