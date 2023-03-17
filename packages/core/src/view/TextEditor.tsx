import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Rectangle } from '../model/Rectangle';
import { RootState } from '../store';
import { CellActions } from '../store/CellSlice';

export const TextEditor = memo(() => {
  const dispatch = useDispatch();
  const editingCell = useSelector((state: RootState) => {
    if (state.cell.operate.editId && state.cell.map[state.cell.operate.editId]) {
      return state.cell.map[state.cell.operate.editId];
    }
  });

  const { scale, translate } = useSelector((state: RootState) => state.cell);

  if (editingCell?.geometry === undefined) {
    return <></>;
  }

  const geometry = Rectangle.from(editingCell.geometry).scale(scale, scale, { x: 0, y: 0 }).offsetByPoint(translate);

  return (
    <div
      className="mxCellEditor mxPlainTextEditor"
      contentEditable
      suppressContentEditableWarning
      data-placeholder="输入文本…"
      ref={(event) => event?.focus()}
      onBlur={({ target }) => {
        if (target.innerText !== editingCell.text) {
          dispatch(CellActions.finishEditing({ cellId: editingCell.id, text: target.innerText }));
        }
      }}
      style={{
        lineHeight: 1.2,
        fontWeight: 'normal',
        fontSize: 14,
        zIndex: 1,
        position: 'absolute',
        width: `${geometry.width}px`,
        height: `${geometry.height}px`,
        left: `${geometry.x}px`,
        top: `${geometry.y}px`,
        outline: 'none',
        overflow: 'hidden',
        fontFamily: `SourceHanSans, Arial, "Microsoft YaHei", "PingFang SC", sans-serif`,
      }}
    >
      {editingCell.text}
    </div>
  );
});
