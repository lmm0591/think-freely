import { useEventListener, useRafState } from 'ahooks';
import { useRef } from 'react';
import { Point } from '../model/Point';

const START_MOVE_LIMIT = 3;

export interface DNDState {
  isMoving: boolean;
  mouseDownPoint?: Point;
  mouseRelativePoint: Point;
  mouseMovePoint?: Point;
  movePoint?: Point;
  isFirstMoving: boolean;
}

const initState: DNDState = {
  isMoving: false,
  isFirstMoving: true,
  mouseDownPoint: undefined,
  mouseRelativePoint: new Point(),
  mouseMovePoint: undefined,
  movePoint: undefined,
};

const createMovingDND = (dnd: Required<DNDState>, mouseMovePoint: Point, isFirstMoving = false) => {
  return {
    isMoving: true,
    mouseRelativePoint: dnd.mouseRelativePoint.clone(),
    mouseMovePoint: mouseMovePoint.clone(),
    mouseDownPoint: dnd.mouseDownPoint.clone() as Point,
    isFirstMoving,
    movePoint: mouseMovePoint.clone().translateByPoint(dnd.mouseDownPoint),
  };
};

export function useDND(
  target: React.MutableRefObject<null>,
  option?: {
    dragStartHandler?: () => void;
    dragMovingHandler?: (dnd: Required<DNDState>) => void;
    dragEndHandler?: (dnd: Required<DNDState>) => void;
  },
) {
  const [dnd, setDnd] = useRafState(initState);
  const isMouseDown = useRef(false);
  const isMoving = useRef(false);
  const moveCount = useRef(0);

  useEventListener(
    'mousedown',
    (event) => {
      isMouseDown.current = true;
      let mouseRelativePoint = new Point();
      const mouseDownPoint = new Point(event.clientX, event.clientY);
      if (target?.current) {
        const { x, y } = (target.current as Element).getBoundingClientRect();
        mouseRelativePoint = new Point(mouseDownPoint.x - x, mouseDownPoint.y - y);
      }
      const isFirstMoving = moveCount.current === 1;
      setDnd({
        isMoving: false,
        mouseRelativePoint,
        mouseDownPoint,
        mouseMovePoint: mouseDownPoint.clone(),
        isFirstMoving,
      });
    },
    {
      target,
    },
  );

  useEventListener('mousemove', (event) => {
    const mouseDownPoint = dnd.mouseDownPoint;
    if (!isMouseDown.current || !mouseDownPoint) {
      return;
    }

    const mouseMovePoint = new Point(event.clientX, event.clientY);
    const isStartMove = !isMoving.current && mouseDownPoint.getDistance(mouseMovePoint) > START_MOVE_LIMIT;

    if (isStartMove) {
      moveCount.current = 0;
      isMoving.current = true;
      option?.dragStartHandler && option?.dragStartHandler();
    }
    if (isStartMove || isMoving.current) {
      moveCount.current += 1;
      const isFirstMoving = moveCount.current === 1;
      option?.dragMovingHandler &&
        option.dragMovingHandler(createMovingDND(dnd as Required<DNDState>, mouseMovePoint.clone(), isFirstMoving));
      setDnd(createMovingDND(dnd as Required<DNDState>, mouseMovePoint.clone(), isFirstMoving));
    }
  });

  useEventListener('mouseup', () => {
    if (isMouseDown.current) {
      isMoving.current && option?.dragEndHandler && option.dragEndHandler(dnd as Required<DNDState>);
      isMoving.current = false;
      isMouseDown.current = false;
      setDnd(initState);
    }
  });

  return dnd;
}
