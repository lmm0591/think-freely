import { Point } from '../../model/Point';
import { Rectangle } from '../../model/Rectangle';

export type RectangleData = Pick<Rectangle, 'x' | 'y' | 'width' | 'height'>;
export type CellType = 'STICKY' | 'GROUP' | 'LINE' | 'TEXT';
export type ArrowType = 'block' | 'blockThin' | 'open' | 'oval' | 'ovalThin' | 'diamond' | 'diamondThin';
export type CellStyle = {
  endArrow?: ArrowType;
  startArrow?: ArrowType;
  fontColor?: string;
  autoWidth?: boolean;
  autoHeight?: boolean;
  fontSize?: number;
};
export type CellData = {
  id: string;
  text?: string;
  geometry?: RectangleData;
  points?: PointData[];
  style: CellStyle;
  children: string[];
  groupId?: string;
  type: CellType;
};

export type GeometryCellData = {
  id: string;
  geometry: RectangleData;
  children: string[];
  groupId?: string;
  type: CellType;
};

export type PointCellData = {
  id: string;
  points: PointData[];
  children: string[];
  groupId?: string;
  type: CellType;
};

export type PointData = Pick<Point, 'x' | 'y'>;
