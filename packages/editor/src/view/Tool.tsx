import { v4 } from 'uuid';
import { CellStore, CellActions } from '@tf/core';

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

  const addStickyAndLine = () => {
    const maxHeight = document.body.clientHeight / scale;
    const maxWidth = document.body.clientWidth / scale;
    const stickyId = v4();
    CellStore.dispatch(
      CellActions.addSticky({
        id: stickyId,
        text: 'Hello',
        geometry: {
          x: Math.random() * maxWidth - translate.x / scale,
          y: Math.random() * maxHeight - translate.y / scale,
          width: 100,
          height: 100,
        },
      }),
    );
    CellStore.dispatch(
      CellActions.addLine({
        id: v4(),
        text: 'Hello',
        source: { id: stickyId, direction: 'E' },
        points: [
          {
            x: Math.random() * maxWidth - translate.x / scale,
            y: Math.random() * maxHeight - translate.y / scale,
          },
        ],
      }),
    );
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

  const addText = (count: number) => {
    const maxHeight = document.body.clientHeight / scale;
    const maxWidth = document.body.clientWidth / scale;
    for (let index = 0; index < count; index++) {
      const x = Math.random() * maxWidth - translate.x / scale;
      const y = Math.random() * maxHeight - translate.y / scale;
      CellStore.dispatch(
        CellActions.addText({
          id: v4(),
          text: 'Hello',
          style: {
            autoWidth: true,
          },
          geometry: {
            x: Math.random() * maxWidth - translate.x / scale,
            y: Math.random() * maxHeight - translate.y / scale,
            width: 70,
            height: 20,
          },
        }),
      );
    }
  };

  return (
    <div>
      <input type="button" value="添加 1000 个元素" onClick={() => addSticky(1000)}></input>
      <input type="button" value="添加 100 个元素" onClick={() => addSticky(100)}></input>
      <input type="button" value="添加 10 个元素" onClick={() => addSticky(10)}></input>
      <input type="button" value="添加 1 个元素" onClick={() => addSticky(1)}></input>
      <input type="button" value="添加 1 个元素加一条线" onClick={() => addStickyAndLine()}></input>
      <input type="button" value="添加 10 个线条" onClick={() => addLine(10)}></input>
      <input type="button" value="添加 10 个文本" onClick={() => addText(10)}></input>
      <input type="button" value="添加 100 个文本" onClick={() => addText(100)}></input>
    </div>
  );
};
