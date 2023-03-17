import { v4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { CellStore, CellActions } from '@tf/core';
import { useEventListener } from 'ahooks';

export const ToolBar = () => {
  const { scale, translate } = CellStore.getState().cell;

  const addSticky = (count: number) => {
    const maxHeight = document.body.clientHeight / scale;
    const maxWidth = document.body.clientWidth / scale;
    for (let index = 0; index < count; index++) {
      CellStore.dispatch(
        CellActions.addSticky({
          id: v4(),
          text: 'Hello',
          geometry: {
            x: Math.random() * maxWidth - translate.x / scale,
            y: Math.random() * maxHeight - translate.y / scale,
            width: 100,
            height: 100,
          },
        }),
      );
    }
  };

  const addLine = (count: number) => {
    const maxHeight = document.body.clientHeight / scale;
    const maxWidth = document.body.clientWidth / scale;
    for (let index = 0; index < count; index++) {
      const x = Math.random() * maxWidth - translate.x / scale;
      const y = Math.random() * maxHeight - translate.y / scale;
      CellStore.dispatch(
        CellActions.addLine({
          id: v4(),
          points: [
            {
              x,
              y,
            },
            {
              x: x + 100,
              y: y + 100,
            },
          ],
        }),
      );
    }
  };

  return (
    <div>
      <input type="button" value="添加 1000 个元素" onClick={() => addSticky(1000)}></input>
      <input type="button" value="添加 10 个元素" onClick={() => addSticky(10)}></input>
      <input type="button" value="添加 1 个元素" onClick={() => addSticky(1)}></input>
      <input type="button" value="添加 10 个线条" onClick={() => addLine(10)}></input>
    </div>
  );
};
