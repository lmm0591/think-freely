import { Point } from './Point';
import { Rectangle } from './Rectangle';

export class Line {
  constructor(public startPoint: Point, public endPoint: Point) {}

  getMidpoint() {
    const x = (this.startPoint.x + this.endPoint.x) / 2;
    const y = (this.startPoint.y + this.endPoint.y) / 2;
    return new Point(x, y);
  }

  /**
   * 检查直线与矩形或类似矩形是否相交
   */
  lineToRectangle(rect: Rectangle): boolean {
    const x1 = this.startPoint.x;
    const y1 = this.startPoint.y;

    const x2 = this.endPoint.x;
    const y2 = this.endPoint.y;

    const bx1 = rect.x;
    const by1 = rect.y;
    const bx2 = rect.right;
    const by2 = rect.bottom;

    let t = 0;

    //  判断直线是否在矩形内
    if ((x1 >= bx1 && x1 <= bx2 && y1 >= by1 && y1 <= by2) || (x2 >= bx1 && x2 <= bx2 && y2 >= by1 && y2 <= by2)) {
      return true;
    }

    if (x1 < bx1 && x2 >= bx1) {
      // 判断左边
      t = y1 + ((y2 - y1) * (bx1 - x1)) / (x2 - x1);

      if (t > by1 && t <= by2) {
        return true;
      }
    } else if (x1 > bx2 && x2 <= bx2) {
      //  判断右边
      t = y1 + ((y2 - y1) * (bx2 - x1)) / (x2 - x1);

      if (t >= by1 && t <= by2) {
        return true;
      }
    }

    if (y1 < by1 && y2 >= by1) {
      //  判断h 边
      t = x1 + ((x2 - x1) * (by1 - y1)) / (y2 - y1);

      if (t >= bx1 && t <= bx2) {
        return true;
      }
    } else if (y1 > by2 && y2 <= by2) {
      //  判断下边
      t = x1 + ((x2 - x1) * (by2 - y1)) / (y2 - y1);

      if (t >= bx1 && t <= bx2) {
        return true;
      }
    }

    return false;
  }
}
