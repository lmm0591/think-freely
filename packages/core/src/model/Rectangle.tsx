import { PointData, RectangleData } from '../store/type/Cell';
import { DirectionFour } from '../view/type/SelectionBox';
import { Point } from './Point';

export class Rectangle extends Point {
  static from({ x, y, width, height }: Pick<Rectangle, 'x' | 'y' | 'width' | 'height'>): Rectangle {
    return new Rectangle(x, y, width, height);
  }

  static fromPoints(points: PointData[]) {
    if (points.length === 0) {
      return;
    }
    if (points.length === 1) {
      return new Rectangle(points[0].x, points[0].y);
    }
    return points.map((point) => new Rectangle(point.x, point.y)).reduce((total, current) => total.add(current));
  }

  static merge(rectangles: Rectangle[]) {
    if (rectangles.length === 1) {
      return rectangles[0];
    }
    return rectangles.reduce((total, current) => total.add(current), rectangles[0].clone());
  }

  constructor(public x = 0, public y = 0, public width = 0, public height = 0) {
    super(x, y);
  }

  toRectangleData(): RectangleData {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }

  add(rect: Rectangle): this {
    if (rect) {
      const minX = Math.min(this.x, rect.x);
      const minY = Math.min(this.y, rect.y);
      const maxX = Math.max(this.x + this.width, rect.x + rect.width);
      const maxY = Math.max(this.y + this.height, rect.y + rect.height);
      this.x = minX;
      this.y = minY;
      this.width = maxX - minX;
      this.height = maxY - minY;
    }
    return this;
  }

  /**
   * 两个矩形是否相交
   */
  intersectByRect(rect: Rectangle) {
    if (this.width <= 0 || this.height <= 0 || rect.width <= 0 || rect.height <= 0) {
      return false;
    }
    return !(this.right < rect.x || this.bottom < rect.y || this.x > rect.right || this.y > rect.bottom);
  }

  getRelativeScale(targetPoint: Point) {
    const dx = targetPoint.x - this.x;
    const dy = targetPoint.y - this.y;

    return new Point(dx / this.width, dy / this.height);
  }

  setScaleX(baseRectScaleX: number, baseRect: Rectangle, direction: DirectionFour = 'E') {
    const flipFactor = baseRectScaleX >= 0 ? 1 : -1;
    if (direction === 'E') {
      let scaleX;
      if (flipFactor === 1) {
        scaleX = baseRect.getRelativeScale(this).x;
      } else {
        scaleX = baseRect.getRelativeScale(this.getPointRight()).x;
      }
      this.width *= baseRectScaleX * flipFactor;
      this.x = baseRect.x + baseRect.width * baseRectScaleX * scaleX;
    } else if (direction === 'W') {
      const scaleX = (baseRect.right - this.right) / baseRect.width;
      this.width *= baseRectScaleX * flipFactor;
      if (flipFactor === 1) {
        this.x = baseRect.right - baseRect.width * baseRectScaleX * scaleX - this.width;
      } else {
        this.x = baseRect.right + baseRect.width * -baseRectScaleX * scaleX;
      }
    }
    return this;
  }

  setScaleY(baseRectScaleY: number, baseRect: Rectangle, direction: DirectionFour = 'S') {
    const flipFactor = baseRectScaleY >= 0 ? 1 : -1;
    if (direction === 'S') {
      let scaleY;
      if (flipFactor === 1) {
        scaleY = baseRect.getRelativeScale(this).y;
      } else {
        scaleY = baseRect.getRelativeScale(this.getPointBottom()).y;
      }
      this.height *= baseRectScaleY * flipFactor;
      this.y = baseRect.y + baseRect.height * baseRectScaleY * scaleY;
    } else if (direction === 'N') {
      const scaleY = (baseRect.bottom - this.bottom) / baseRect.height;
      this.height *= baseRectScaleY * flipFactor;
      if (flipFactor === 1) {
        this.y = baseRect.bottom - baseRect.height * baseRectScaleY * scaleY - this.height;
      } else {
        this.y = baseRect.bottom + baseRect.height * -baseRectScaleY * scaleY;
      }
    }
    return this;
  }

  getPointA() {
    return new Point(this.left, this.top);
  }

  getPointB() {
    return new Point(this.right, this.top);
  }

  getPointC() {
    return new Point(this.right, this.bottom);
  }

  getPointD() {
    return new Point(this.left, this.bottom);
  }

  getPointTop(): Point {
    return new Point(this.centerX, this.top);
  }

  getPointLeft(): Point {
    return new Point(this.left, this.centerY);
  }

  getPointRight(): Point {
    return new Point(this.right, this.centerY);
  }

  getPointBottom(): Point {
    return new Point(this.centerX, this.bottom);
  }

  /**
   * 按给定量缩放此矩形的宽度和高度。
   */
  scale(x: number, y = x, basePoint?: PointData) {
    this.width *= x;
    this.height *= y;
    if (basePoint) {
      this.x = (this.x - basePoint.x) * x;
      this.y = (this.y - basePoint.y) * y;
    }
    return this;
  }

  clone(): Rectangle {
    return new Rectangle(this.x, this.y, this.width, this.height);
  }

  setWidth(width: number, miniWidth = 0): this {
    this.width = Math.max(miniWidth, Math.abs(width));
    return this;
  }

  setHeight(height: number, miniHeight = 0): this {
    this.height = Math.max(miniHeight, Math.abs(height));
    return this;
  }

  getPointByDirection(direction: DirectionFour): Point {
    if (direction === 'E') {
      return this.getPointRight();
    } else if (direction === 'S') {
      return this.getPointBottom();
    } else if (direction === 'W') {
      return this.getPointLeft();
    } else if (direction === 'N') {
      return this.getPointTop();
    }
    return this.getCenterPoint();
  }

  grow(amount: number) {
    return this.growX(amount).growY(amount);
  }

  growX(amount: number) {
    this.x -= amount;
    this.width += 2 * amount;
    return this;
  }

  growY(amount: number) {
    this.y -= amount;
    this.height += 2 * amount;
    return this;
  }

  /**
   * 设置 left 会影响 width 与 x
   */
  set left(value: number) {
    if (value >= this.right) {
      this.width = 0;
    } else {
      this.width = this.right - value;
    }
    this.x = value;
  }

  get left(): number {
    return this.x;
  }

  /**
   * 设置 right 会影响 width
   */
  set right(value: number) {
    if (value <= this.x) {
      this.width = 0;
    } else {
      this.width = value - this.x;
    }
  }

  get right(): number {
    return this.x + this.width;
  }

  /**
   * 设置 top 会影响 height 与 y
   */
  set top(value: number) {
    if (value >= this.bottom) {
      this.height = 0;
    } else {
      this.height = this.bottom - value;
    }
    this.y = value;
  }

  get top(): number {
    return this.y;
  }

  /**
   * 设置 bottom 会影响 height
   */
  set bottom(value: number) {
    if (value <= this.y) {
      this.height = 0;
    } else {
      this.height = value - this.y;
    }
  }

  get bottom(): number {
    return this.y + this.height;
  }

  get centerX(): number {
    return this.x + this.width / 2;
  }

  set centerX(value: number) {
    this.x = value - this.width / 2;
  }

  get centerY(): number {
    return this.y + this.height / 2;
  }

  set centerY(value: number) {
    this.y = value - this.height / 2;
  }

  getCenterPoint(): Point {
    return new Point(this.centerX, this.centerY);
  }
}
