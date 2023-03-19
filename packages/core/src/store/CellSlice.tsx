import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { Line } from '../model/Line';
import { Point } from '../model/Point';
import { Rectangle } from '../model/Rectangle';
import { DirectionFour } from '../view/type/SelectionBox';
import { getSelectedCellGeometry } from './CellSelector';
import { CellData, CellStyle, GeometryCellData, PointCellData, PointData, RectangleData } from './type/Cell';

export interface CellState {
  selectedCellIds: string[];
  map: Record<string, CellData>;
  translate: PointData;
  scale: number;
  operate: {
    rubberBand: boolean;
    editId: string | undefined;
    scalePoint: PointData | undefined;
  };
}

export const initialState: CellState = {
  map: {},
  selectedCellIds: [],
  translate: { x: 0, y: 0 },
  scale: 1,
  operate: {
    scalePoint: undefined,
    editId: undefined,
    rubberBand: false,
  },
};

function moveRect(state: CellState, selectRect: Rectangle, movePoint: PointData) {
  state.selectedCellIds
    .filter((id) => state.map[id]?.geometry)
    .map((id) => state.map[id] as GeometryCellData)
    .forEach((cell) => {
      const offsetPoint = Point.from(cell.geometry).getRelativePoint(selectRect);
      cell.geometry.x = offsetPoint.x + movePoint.x;
      cell.geometry.y = offsetPoint.y + movePoint.y;
    });
}

function moveLine(state: CellState, selectRect: Rectangle, movePoint: PointData) {
  state.selectedCellIds
    .filter((id) => {
      const points = state.map[id]?.points;
      return points && points.length >= 2;
    })
    .flatMap((id) => state.map[id].points as PointData[])
    .forEach((point) => {
      const offsetPoint = Point.from(point).getRelativePoint(selectRect);
      point.x = offsetPoint.x + movePoint.x;
      point.y = offsetPoint.y + movePoint.y;
    });
}

function resizeLinePints(
  state: CellState,
  lineCells: PointCellData[],
  oldDisplayRect: Rectangle,
  direction: DirectionFour,
  vector: number,
) {
  lineCells.forEach((cell) => {
    const stateCell = state.map[cell.id] as PointCellData;
    if (stateCell?.points === undefined) {
      return;
    }

    if (['E', 'W'].includes(direction)) {
      const scaleWidth = (oldDisplayRect.width + vector) / oldDisplayRect.width;
      cell.points.forEach((point, index) => {
        const { x } = new Rectangle(point.x, point.y).setScaleX(scaleWidth, oldDisplayRect, direction);
        stateCell.points[index].x = x;
      });
    }

    if (['S', 'N'].includes(direction)) {
      const scaleHeight = (oldDisplayRect.height + vector) / oldDisplayRect.height;
      cell.points.forEach((point, index) => {
        const { y } = new Rectangle(point.x, point.y).setScaleY(scaleHeight, oldDisplayRect, direction);
        stateCell.points[index].y = y;
      });
    }
  });
}

function resizeRectCells(
  state: CellState,
  displayCells: GeometryCellData[],
  oldDisplayRect: Rectangle,
  direction: DirectionFour,
  vector: number,
) {
  displayCells.forEach((cell) => {
    const stateCell = state.map[cell.id];
    if (stateCell?.geometry === undefined) {
      return;
    }
    if (['E', 'W'].includes(direction)) {
      const scaleWidth = (oldDisplayRect.width + vector) / oldDisplayRect.width;
      const { width, x } = Rectangle.from(cell.geometry).setScaleX(scaleWidth, oldDisplayRect, direction);
      stateCell.geometry.x = x;
      stateCell.geometry.width = width;
    }

    if (['S', 'N'].includes(direction)) {
      const scaleHeight = (oldDisplayRect.height + vector) / oldDisplayRect.height;
      const { height, y } = Rectangle.from(cell.geometry).setScaleY(scaleHeight, oldDisplayRect, direction);
      stateCell.geometry.y = y;
      stateCell.geometry.height = height;
    }
  });
}

export const CellSlice = createSlice({
  name: 'Cell',
  initialState,
  reducers: {
    addSticky: (state, { payload }: PayloadAction<Omit<CellData, 'type' | 'children' | 'style'> & { style?: CellStyle }>) => {
      state.map[payload.id] = { style: {}, ...payload, type: 'STICKY', children: [] };
    },
    addLine: (state, { payload }: PayloadAction<Omit<CellData, 'type' | 'children' | 'style'> & { style?: CellStyle }>) => {
      if (payload.points === undefined || payload.points.length < 2) {
        return;
      }
      state.map[payload.id] = { style: {}, ...payload, type: 'LINE', children: [] };
    },
    addText: (state, { payload }: PayloadAction<Omit<CellData, 'type' | 'children' | 'style'> & { style?: CellStyle }>) => {
      state.map[payload.id] = { style: {}, ...payload, type: 'TEXT', children: [] };
    },
    updateStyle: (state, { payload }: PayloadAction< { ids: string[], style: CellStyle }>) => {
      payload.ids.filter((id) => state.map[id]).forEach(id => {
        state.map[id].style = { ...state.map[id].style, ...payload.style }
      })
    },
    moveCellsBySelected: (state, { payload }: PayloadAction<PointData>) => {
      const selectedRect = getSelectedCellGeometry(state.selectedCellIds, state.map);
      if (selectedRect === undefined) {
        return;
      }
      moveRect(state, selectedRect, payload);
      moveLine(state, selectedRect, payload);
    },
    selectDisplayCells: (state, { payload }: PayloadAction<string[]>) => {
      state.selectedCellIds = payload;
    },
    selectGroup: (state, { payload }: PayloadAction<string>) => {
      const groupCell = state.map[payload];
      if (groupCell) {
        state.selectedCellIds = [payload, ...groupCell.children];
      }
    },
    selectCellsByRect: (state, { payload }: PayloadAction<RectangleData>) => {
      const selectedRect = Rectangle.from(payload);

      const selectedDisplayCells = Object.values(state.map).filter((cell) => {
        if (cell.geometry) {
          return Rectangle.from(cell.geometry).intersectByRect(selectedRect);
        } else if (cell.points && cell.points.length >= 2) {
          const points = cell.points;
          return points.some((point, index) => {
            const nextPointIndex = index + 1;
            if (nextPointIndex === points.length) {
              return false;
            }
            return new Line(Point.from(point), Point.from(points[nextPointIndex])).lineToRectangle(selectedRect);
          });
        }
      });
      const groupCells = selectedDisplayCells.flatMap((displayCell) => (displayCell.groupId ? state.map[displayCell.groupId] : []));
      const groupChildren = groupCells.flatMap((groupCell) => groupCell.children.map((id) => state.map[id]));
      state.selectedCellIds = [...new Set([...groupCells, ...groupChildren, ...selectedDisplayCells].map(({ id }) => id))];
    },
    clearSelected: (state) => {
      state.selectedCellIds = [];
      state.operate.editId = undefined;
    },
    resizeCells: (
      state,
      { payload: { orgCells, vector, direction } }: PayloadAction<{ orgCells: CellData[]; vector: number; direction: DirectionFour }>,
    ) => {
      if (orgCells.length === 0) {
        return;
      }
      const lineCells = (orgCells.filter(({ points }) => points) as PointCellData[]) || [];
      const displayCells = orgCells.filter(({ type, geometry }) => type !== 'GROUP' && geometry) as GeometryCellData[];
      let oldDisplayRect = Rectangle.merge(displayCells.map((cell) => Rectangle.from(cell.geometry)));
      const oldLineRect = Rectangle.fromPoints(lineCells.flatMap(({ points }) => points));
      if (oldLineRect !== undefined) {
        oldDisplayRect = Rectangle.merge([oldDisplayRect, oldLineRect]);
      }
      resizeRectCells(state, displayCells, oldDisplayRect, direction, vector);
      resizeLinePints(state, lineCells, oldDisplayRect, direction, vector);
    },
    resizeLine: (state, { payload }: PayloadAction<{ id: string; points: PointData[] }>) => {
      if (state.map[payload.id] === undefined || payload.points?.length < 2) {
        return;
      }
      state.map[payload.id].points = payload.points;
    },
    moveCell: (state, { payload }: PayloadAction<{ id: string; point: PointData }>) => {
      const cell = state.map[payload.id];
      if (cell.geometry) {
        cell.geometry.x = payload.point.x;
        cell.geometry.y = payload.point.y;
        return;
      } else if (cell.points && cell.points.length > 1) {
        const { x, y } = Rectangle.fromPoints(cell.points) as Rectangle;
        const dx = payload.point.x - x;
        const dy = payload.point.y - y;
        cell.points = cell.points.map((point) => {
          point.x += dx;
          point.y += dy;
          return point;
        });
      }
    },
    operateRubberBand: (state, { payload }: PayloadAction<boolean>) => {
      state.operate.rubberBand = payload;
    },
    editCell: (state, { payload }: PayloadAction<string>) => {
      if (state.map[payload]) {
        state.operate.editId = payload;
      } else {
        state.operate.editId = undefined;
      }
    },
    createGroup(state, { payload: { id, children } }: PayloadAction<{ id: string; children: string[] }>) {
      const cells = children.flatMap((id) => (state.map[id] ? [state.map[id]] : []));
      if (cells.length < 2) {
        return;
      }
      state.map[id] = { id, children, style: {}, type: 'GROUP' };

      cells.forEach((cell) => {
        state.map[cell.id].groupId = id;
      });
    },
    translate(state, { payload: { x, y } }: PayloadAction<{ x: number; y: number }>) {
      state.translate.x = x;
      state.translate.y = y;
    },
    scale(state, { payload: { scale, basePoint } }: PayloadAction<{ scale: number; basePoint: PointData }>) {
      const MAX_SCALE = 4;
      const MIN_SCALE = 0.05;
      if (scale >= MAX_SCALE) {
        scale = MAX_SCALE;
      }
      if (scale <= MIN_SCALE) {
        scale = MIN_SCALE;
      }
      const preScale = state.scale;
      const preX = state.translate.x;
      const preY = state.translate.y;
      state.translate.x = basePoint.x - ((basePoint.x - preX) / preScale) * scale;
      state.translate.y = basePoint.y - ((basePoint.y - preY) / preScale) * scale;
      state.scale = +scale;
    },
    finishEditing(state, { payload: { cellId, text } }: PayloadAction<{ cellId: string; text: string }>) {
      if (state.map[cellId]) {
        state.map[cellId].text = text;
        state.operate.editId = undefined;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const CellActions = CellSlice.actions;

export const CellReduce = CellSlice.reducer;
