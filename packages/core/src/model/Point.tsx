import { PointData } from '../store/type/Cell';

export class Point {
  static from({ x, y }: Pick<Point, 'x' | 'y'>) {
    return new Point(x, y);
  }

  constructor(public x = 0, public y = 0) {}

  offset(x: number, y = x): this {
    this.x += x;
    this.y += y;

    return this;
  }

  offsetByPoint({ x, y }: PointData): this {
    this.x += x;
    this.y += y;

    return this;
  }

  translateByPoint(point: PointData) {
    this.x -= point.x;
    this.y -= point.y;
    return this;
  }

  scale(x: number, y = x) {
    this.x *= x;
    this.y *= y;
    return this;
  }

  clone() {
    return new Point(this.x, this.y);
  }

  getDistance(targetPoint: Point) {
    const dx = this.x - targetPoint.x;
    const dy = this.y - targetPoint.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  getRelativePoint(targetPoint: Point) {
    const dx = this.x - targetPoint.x;
    const dy = this.y - targetPoint.y;

    return new Point(dx, dy);
  }

  toData(): PointData {
    return { x: this.x, y: this.y };
  }
}
