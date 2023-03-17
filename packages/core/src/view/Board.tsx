import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEventListener } from 'ahooks';
import { RootState } from '../store';
import { Background } from './Background';
import { SelectionBox } from './SelectionBox';
import { SelectionLine } from './SelectionLineBox';
import { Sticky } from './Sticky';
import { RubberBand } from './RubberBand';
import { useDND } from '../hook/useDND';
import { Rectangle } from '../model/Rectangle';
import { CellActions } from '../store/CellSlice';
import { Group } from './Group';
import { TextEditor } from './TextEditor';
import { Line } from './Line';
import { ArrowDefs } from './ArrowDefs';

export const Board = () => {
  const cells = useSelector((state: RootState) => Object.values(state.cell.map));
  const { translate, scale, selectedCellIds } = useSelector((state: RootState) => state.cell);
  const [rubberBandRect, setRubberBandRect] = useState<Rectangle>();
  const dispatch = useDispatch();
  const ref = useRef(null);

  useEventListener('dblclick', (event) => {
    const target = event.composedPath()[0] as HTMLElement;
    if (target.classList.contains('mx-selection-box') && selectedCellIds.length === 1) {
      dispatch(CellActions.editCell(selectedCellIds[0]));
    }
  });

  /*
  const { translate, scale } = useSelector((state: RootState) => state.cell);

  useEventListener(
    'wheel',
    (event) => {
      event.stopPropagation();
      event.preventDefault();
      if (event.metaKey || event.ctrlKey) {
        dispatch(CellActions.scale({ scale: scale * (event.deltaY < 0 ? 1.25 : 0.8), basePoint: { x: event.clientX, y: event.clientY } }));
      } else {
        let x = translate.x;
        let y = translate.y;
        x = translate.x - event.deltaX;
        y = translate.y - event.deltaY;
        dispatch(CellActions.translate({ x, y }));
      }
    },
    { passive: false },
  );
  */

  useDND(ref, {
    dragStartHandler: () => {
      dispatch(CellActions.operateRubberBand(true));
    },
    dragMovingHandler: ({ mouseDownPoint, mouseMovePoint }) => {
      setRubberBandRect(Rectangle.fromPoints([mouseDownPoint, mouseMovePoint]));
    },
    dragEndHandler: ({ mouseDownPoint, mouseMovePoint }) => {
      setRubberBandRect(undefined);
      dispatch(CellActions.operateRubberBand(false));
      dispatch(
        CellActions.selectCellsByRect(
          (
            Rectangle.fromPoints([
              mouseDownPoint
                .clone()
                .translateByPoint(translate)
                .scale(1 / scale),
              mouseMovePoint
                .clone()
                .translateByPoint(translate)
                .scale(1 / scale),
            ]) as Rectangle
          ).toRectangleData(),
        ),
      );
    },
  });

  return (
    <>
      <svg
        style={{
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      >
        <ArrowDefs></ArrowDefs>
        <Background ref={ref}></Background>
        <g className="mx-canvas" transform={`translate(${translate.x}, ${translate.y}) scale(${scale})`}>
          {cells.map((cell) => {
            if (cell.type === 'GROUP') {
              return <Group key={cell.id} cellId={cell.id}></Group>;
            } else if (cell.type === 'LINE') {
              return <Line key={cell.id} cellId={cell.id}></Line>;
            } else if (cell.type === 'STICKY') {
              return <Sticky key={cell.id} cellId={cell.id}></Sticky>;
            }
          })}
        </g>
        <g className="mx-overlay">
          <SelectionBox></SelectionBox>
          <SelectionLine></SelectionLine>
        </g>
      </svg>
      <RubberBand rect={rubberBandRect}></RubberBand>
      <TextEditor></TextEditor>
    </>
  );
};
