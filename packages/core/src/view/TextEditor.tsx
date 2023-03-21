import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Rectangle } from '../model/Rectangle';
import { RootState } from '../store';
import { CellActions } from '../store/CellSlice';
import { RectangleData } from '../store/type/Cell';

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
      onInput={(event) => {
        const calculateRectDom = document.createElement('div');
        calculateRectDom.innerHTML = (event.target as HTMLDivElement).innerHTML || '';
        calculateRectDom.style.display = 'inline-block';
        calculateRectDom.style.fontSize = `${editingCell.style.fontSize}px`;
        calculateRectDom.style.lineHeight = '1.2';
        document.body.appendChild(calculateRectDom);
        if (editingCell.style.autoWidth) {
          const { width } = calculateRectDom.getBoundingClientRect();
          const geometry = editingCell.geometry as RectangleData;
          dispatch(CellActions.resizeCell({ id: editingCell.id, geometry: { ...geometry, width: Math.ceil(width) } }));
        } else if (editingCell.style.autoHeight) {
          calculateRectDom.style.width = `${editingCell.geometry?.width}px`;
          calculateRectDom.style.wordBreak = 'break-word';
          const { height } = calculateRectDom.getBoundingClientRect();
          const geometry = editingCell.geometry as RectangleData;
          dispatch(CellActions.resizeCell({ id: editingCell.id, geometry: { ...geometry, height: Math.ceil(height) } }));
        }
        calculateRectDom.remove();
      }}
      onBlur={({ target }) => {
        if (target.innerText !== editingCell.text) {
          dispatch(CellActions.finishEditing({ cellId: editingCell.id, text: target.innerText }));
        }
      }}
      style={{
        lineHeight: 1.2,
        fontWeight: 'normal',
        fontSize: `${editingCell.style.fontSize}px`,
        zIndex: 1,
        position: 'absolute',
        wordBreak: 'break-word',
        width: `${editingCell.geometry.width}px`,
        height: `${editingCell.geometry.height}px`,
        left: `${geometry.x}px`,
        top: `${geometry.y}px`,
        outline: 'none',
        overflow: 'hidden',
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
    >
      {editingCell.text}
    </div>
  );
});
