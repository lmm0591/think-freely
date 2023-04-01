import { useMouse, useEventListener } from 'ahooks';
import { useDispatch, useSelector } from 'react-redux';
import { Point } from '../model/Point';
import { Rectangle } from '../model/Rectangle';
import { RootState } from '../store';
import { CellActions } from '../store/CellSlice';
import { RectangleData } from '../store/type/Cell';
import { DirectionFour } from './type/SelectionBox';

export const JoinBox = () => {
  const isEditingLine = useSelector((state: RootState) => {
    const { map, operate } = state.cell;
    return operate.editId !== undefined && map[operate.editId]?.type === 'LINE';
  });
  const { translate, scale } = useSelector((state: RootState) => state.cell);
  const dispatch = useDispatch();
  const joinCell = useJoinCell(isEditingLine);
  const { clientX, clientY } = useMouse();
  const mousePoint = new Point(clientX, clientY).translateByPoint(translate).scale(1 / scale);
  useEventListener('mouseup', () => {
    if (joinCell === undefined || joinCell.geometry === undefined) {
      return;
    }
    const rectangle = Rectangle.from(joinCell.geometry);
    const connector = [
      { direction: 'N' as DirectionFour, point: rectangle.getPointTop() },
      { direction: 'E' as DirectionFour, point: rectangle.getPointRight() },
      { direction: 'S' as DirectionFour, point: rectangle.getPointBottom() },
      { direction: 'W' as DirectionFour, point: rectangle.getPointLeft() },
    ].sort(({ point: pointA }, { point: pointB }) => pointA.getDistance(mousePoint) - pointB.getDistance(mousePoint))[0];

    dispatch(
      CellActions.finishLineResize({
        connectCell: {
          id: joinCell.id,
          direction: connector.direction,
        },
      }),
    );
  });
  if (joinCell === undefined) {
    return <></>;
  }

  const [top, right, bottom, left] = Rectangle.from(joinCell.geometry as RectangleData)
    .getFourDirectionsPoints()
    .map((point) => point.scale(scale).offsetByPoint(translate));

  return (
    <g data-join-box>
      <ellipse cx={top.x} cy={top.y} rx="3" ry="3" fill="#576ee0" opacity="0.5"></ellipse>
      <ellipse cx={right.x} cy={right.y} rx="3" ry="3" fill="#576ee0" opacity="0.5"></ellipse>
      <ellipse cx={bottom.x} cy={bottom.y} rx="3" ry="3" fill="#576ee0" opacity="0.5"></ellipse>
      <ellipse cx={left.x} cy={left.y} rx="3" ry="3" fill="#576ee0" opacity="0.5"></ellipse>
      <rect width={joinCell.geometry?.width} height={joinCell.geometry?.height} opacity="0"></rect>
    </g>
  );
};

function useJoinCell(isEditingLine: boolean) {
  const { clientX, clientY } = useMouse();
  const { translate, scale } = useSelector((state: RootState) => state.cell);
  return useSelector((state: RootState) => {
    if (!isEditingLine) {
      return;
    }
    return Object.values(state.cell.map)
      .filter((cell) => cell.geometry)
      .find((cell) => {
        return Rectangle.from(cell.geometry as RectangleData)
          .scale(scale, scale, { x: 0, y: 0 })
          .offsetByPoint(translate)
          .grow(5)
          .contains({ x: clientX, y: clientY });
      });
  });
}
