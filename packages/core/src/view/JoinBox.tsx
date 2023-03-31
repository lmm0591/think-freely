import { useMouse } from 'ahooks';
import { useSelector } from 'react-redux';
import { Rectangle } from '../model/Rectangle';
import { RootState } from '../store';
import { RectangleData } from '../store/type/Cell';

export const JoinBox = () => {
  const isEditingLine = useSelector((state: RootState) => {
    const { map, operate } = state.cell;
    return operate.editId !== undefined && map[operate.editId]?.type === 'LINE';
  });

  const joinCell = useJoinCell(isEditingLine);

  if (joinCell === undefined) {
    return <></>;
  }

  const [top, right, bottom, left] = Rectangle.from(joinCell.geometry as RectangleData).getFourDirectionsPoints();

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

  return useSelector((state: RootState) => {
    if (!isEditingLine) {
      return;
    }
    return Object.values(state.cell.map)
      .filter((cell) => cell.geometry)
      .find((cell) => {
        return Rectangle.from(cell.geometry as RectangleData)
          .grow(5)
          .contains({ x: clientX, y: clientY });
      });
  });
}
