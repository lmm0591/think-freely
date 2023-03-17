import { useRef, memo, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDND } from '../hook/useDND';
import { EmitterContext } from '../main';
import { RootState } from '../store';
import { CellActions } from '../store/CellSlice';

const SHADOW_NORMAL_WIDTH = 400;

export const Sticky = memo(({ cellId }: { cellId: string }) => {
  const dispatch = useDispatch();
  const { translate, scale } = useSelector((state: RootState) => state.cell);
  const editId = useSelector((state: RootState) => state.cell.operate.editId);
  const ref = useRef(null);
  const emitter = useContext(EmitterContext);
  useDND(ref, {
    dragMovingHandler: ({ mouseMovePoint, mouseRelativePoint }) => {
      dispatch(
        CellActions.moveCell({
          id: cellId,
          point: mouseMovePoint
            .translateByPoint(translate)
            .scale(1 / scale)
            .translateByPoint(mouseRelativePoint.scale(1 / scale))
            .toData(),
        }),
      );
    },
  });
  const stickyCell = useSelector((state: RootState) => state.cell.map[cellId]);

  if (stickyCell === undefined || stickyCell.geometry === undefined) {
    return <></>;
  }
  const scaleX = (stickyCell.geometry.width / SHADOW_NORMAL_WIDTH).toFixed(2);
  const scaleY = Math.min(Math.max(stickyCell.geometry.height / SHADOW_NORMAL_WIDTH, 0.5), 1).toFixed(2);
  return (
    <g
      ref={ref}
      className="mx-shape"
      data-cell-id={stickyCell.id}
      transform={`translate(${stickyCell.geometry.x}, ${stickyCell.geometry.y})`}
    >
      <image
        xlinkHref="data:image/png;base64,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"
        width="400.00"
        height="24.00"
        style={{
          transform: `translate(0px,${stickyCell.geometry.height}px) scale(${scaleX}, ${scaleY})`,
        }}
      ></image>
      <rect
        width={stickyCell.geometry.width}
        height={stickyCell.geometry.height}
        fill="#ffcf2f"
        stroke="none"
        pointerEvents="all"
        onClick={() => {
          dispatch(CellActions.selectDisplayCells([cellId]));
          emitter.emit('tf-select-cells', [cellId]);
        }}
      ></rect>
      <foreignObject
        pointerEvents="none"
        style={{ userSelect: 'none', display: cellId === editId ? 'none' : '', wordBreak: 'break-all' }}
        width={stickyCell.geometry.width}
        height={stickyCell.geometry.height}
      >
        <div>{stickyCell.text}</div>
      </foreignObject>
    </g>
  );
});
