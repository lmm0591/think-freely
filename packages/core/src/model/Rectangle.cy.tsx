import { Point } from './Point';
import { Rectangle } from './Rectangle';

describe('测试 Rectangle', () => {
  it('当使用两个点创建一个矩形时，将返回两点对角生成的矩形', () => {
    const rect = Rectangle.fromPoints([new Point(10, 10), new Point(100, 100)]);
    chai.expect(rect).contain({ x: 10, y: 10, width: 90, height: 90 });
  });

  it('当 TargetPoint 的坐标小于 SourcePoint 时，将使用 TargetPoint 为矩形的起点坐标', () => {
    const rect = Rectangle.fromPoints([new Point(10, 10), new Point(-100, -100)]);
    chai.expect(rect).contain({ x: -100, y: -100, width: 110, height: 110 });
  });

  describe('测试 setScaleX 方法', () => {
    describe('测试基于原点相等', () => {
      let insideRect: Rectangle;
      let baseRect: Rectangle;
      beforeEach(() => {
        insideRect = new Rectangle(100, 0, 50, 50);
        baseRect = new Rectangle(100, 0, 100, 100);
      });

      it('宽度为参照矩形的 1/2，水平缩放 2 倍', () => {
        insideRect.setScaleX(2, baseRect);

        chai.expect(insideRect).contain({ x: 100, width: 100 });
      });

      it('宽度为参照矩形的 1/2，水平缩放 0.5 倍', () => {
        insideRect.setScaleX(0.5, baseRect);

        chai.expect(insideRect).contain({ x: 100, width: 25 });
      });

      it('宽度为参照矩形的 1/2，水平缩放 0.5 倍，缩放方向为 W', () => {
        insideRect.setScaleX(0.5, baseRect, 'W');

        chai.expect(insideRect).contain({ x: 150, width: 25 });
      });

      it('宽度为参照矩形的 1/2，水平翻转缩放', () => {
        insideRect.setScaleX(-1, baseRect);

        chai.expect(insideRect).contain({ x: 50, width: 50 });
      });

      it('宽度为参照矩形的 1/2，水平翻转缩放，缩放方向为 W', () => {
        insideRect.setScaleX(-1, baseRect, 'W');

        chai.expect(insideRect).contain({ x: 250, width: 50 });
      });

      it('宽度为参照矩形的 1/2，水平翻转缩放 0.5 倍', () => {
        insideRect.setScaleX(-0.5, baseRect);

        chai.expect(insideRect).contain({ x: 75, width: 25 });
      });

      it('宽度为参照矩形的 1/2，水平翻转缩放 0.5 倍，缩放方向为 W', () => {
        insideRect.setScaleX(-0.5, baseRect, 'W');

        chai.expect(insideRect).contain({ x: 225, width: 25 });
      });

      it('宽度为参照矩形的 1/2，水平翻转缩放 2 倍', () => {
        insideRect.setScaleX(-2, baseRect);

        chai.expect(insideRect).contain({ x: 0, width: 100 });
      });

      it('宽度为参照矩形的 1/2，水平翻转缩放 2 倍，缩放方向为 W', () => {
        insideRect.setScaleX(-2, baseRect, 'W');

        chai.expect(insideRect).contain({ x: 300, width: 100 });
      });
    });

    describe('测试距离原点 50', () => {
      let insideRect: Rectangle;
      let baseRect: Rectangle;
      beforeEach(() => {
        insideRect = new Rectangle(150, 0, 50, 50);
        baseRect = new Rectangle(100, 0, 100, 100);
      });

      it('宽度为参照矩形的 1/2，水平缩放 2 倍', () => {
        insideRect.setScaleX(2, baseRect);

        chai.expect(insideRect).contain({ x: 200, width: 100 });
      });

      it('宽度为参照矩形的 1/2，水平缩放 2 倍，缩放方向为 W', () => {
        insideRect.setScaleX(2, baseRect, 'W');

        chai.expect(insideRect).contain({ x: 100, width: 100 });
      });

      it('宽度为参照矩形的 1/2，水平缩放 0.5 倍', () => {
        insideRect.setScaleX(0.5, baseRect);

        chai.expect(insideRect).contain({ x: 125, width: 25 });
      });

      it('宽度为参照矩形的 1/2，水平缩放 0.5 倍，缩放方向为 W', () => {
        insideRect.setScaleX(0.5, baseRect, 'W');

        chai.expect(insideRect).contain({ x: 175, width: 25 });
      });

      it('宽度为参照矩形的 1/2，水平翻转缩放', () => {
        insideRect.setScaleX(-1, baseRect);

        chai.expect(insideRect).contain({ x: 0, width: 50 });
      });

      it('宽度为参照矩形的 1/2，水平翻转缩放，缩放方向为 W', () => {
        insideRect.setScaleX(-1, baseRect, 'W');

        chai.expect(insideRect).contain({ x: 200, width: 50 });
      });

      it('宽度为参照矩形的 1/2，水平翻转缩放 2 倍', () => {
        insideRect.setScaleX(-2, baseRect);

        chai.expect(insideRect).contain({ x: -100, width: 100 });
      });

      it('宽度为参照矩形的 1/2，水平翻转缩放 2 倍，缩放方向为 W', () => {
        insideRect.setScaleX(-2, baseRect, 'W');

        chai.expect(insideRect).contain({ x: 200, width: 100 });
      });
    });
  });

  describe('测试 setScaleY 方法', () => {
    describe('测试基于原点相等', () => {
      let insideRect: Rectangle;
      let baseRect: Rectangle;
      beforeEach(() => {
        insideRect = new Rectangle(0, 100, 50, 50);
        baseRect = new Rectangle(0, 100, 100, 100);
      });

      it('高度为参照矩形的 1/2，垂直缩放 2 倍，缩放方向为 S', () => {
        insideRect.setScaleY(2, baseRect, 'S');

        chai.expect(insideRect).contain({ y: 100, height: 100 });
      });

      it('高度为参照矩形的 1/2，垂直缩放 2 倍，缩放方向为 N', () => {
        insideRect.setScaleY(2, baseRect, 'N');

        chai.expect(insideRect).contain({ y: 0, height: 100 });
      });

      it('高度为参照矩形的 1/2，垂直缩放 0.5 倍，缩放方向为 S', () => {
        insideRect.setScaleY(0.5, baseRect, 'S');

        chai.expect(insideRect).contain({ y: 100, height: 25 });
      });

      it('高度为参照矩形的 1/2，垂直缩放 0.5 倍，缩放方向为 N', () => {
        insideRect.setScaleY(0.5, baseRect, 'N');

        chai.expect(insideRect).contain({ y: 150, height: 25 });
      });

      it('高度为参照矩形的 1/2，垂直缩放 -0.5 倍，缩放方向为 S', () => {
        insideRect.setScaleY(-0.5, baseRect, 'S');

        chai.expect(insideRect).contain({ y: 75, height: 25 });
      });

      it('高度为参照矩形的 1/2，垂直缩放 -0.5 倍，缩放方向为 N', () => {
        insideRect.setScaleY(-0.5, baseRect, 'N');

        chai.expect(insideRect).contain({ y: 225, height: 25 });
      });

      it('高度为参照矩形的 1/2，垂直缩放 -2 倍，缩放方向为 S', () => {
        insideRect.setScaleY(-2, baseRect, 'S');

        chai.expect(insideRect).contain({ y: 0, height: 100 });
      });

      it('高度为参照矩形的 1/2，垂直缩放 -2 倍，缩放方向为 N', () => {
        insideRect.setScaleY(-2, baseRect, 'N');

        chai.expect(insideRect).contain({ y: 300, height: 100 });
      });
    });

    describe('测试距离原点 50', () => {
      let insideRect: Rectangle;
      let baseRect: Rectangle;
      beforeEach(() => {
        insideRect = new Rectangle(0, 150, 50, 50);
        baseRect = new Rectangle(0, 100, 100, 100);
      });
      it('高度为参照矩形的 1/2，垂直缩放 2 倍，缩放方向为 S', () => {
        insideRect.setScaleY(2, baseRect, 'S');

        chai.expect(insideRect).contain({ y: 200, height: 100 });
      });

      it('高度为参照矩形的 1/2，垂直缩放 2 倍，缩放方向为 N', () => {
        insideRect.setScaleY(2, baseRect, 'N');

        chai.expect(insideRect).contain({ y: 100, height: 100 });
      });

      it('高度为参照矩形的 1/2，垂直缩放 0.5 倍，缩放方向为 S', () => {
        insideRect.setScaleY(0.5, baseRect, 'S');

        chai.expect(insideRect).contain({ y: 125, height: 25 });
      });

      it('高度为参照矩形的 1/2，垂直缩放 0.5 倍，缩放方向为 N', () => {
        insideRect.setScaleY(0.5, baseRect, 'N');

        chai.expect(insideRect).contain({ y: 175, height: 25 });
      });

      it('高度为参照矩形的 1/2，垂直缩放 -0.5 倍，缩放方向为 S', () => {
        insideRect.setScaleY(-0.5, baseRect, 'S');

        chai.expect(insideRect).contain({ y: 50, height: 25 });
      });

      it('高度为参照矩形的 1/2，垂直缩放 -0.5 倍，缩放方向为 N', () => {
        insideRect.setScaleY(-0.5, baseRect, 'N');

        chai.expect(insideRect).contain({ y: 200, height: 25 });
      });

      it('高度为参照矩形的 1/2，垂直缩放 -2 倍，缩放方向为 S', () => {
        insideRect.setScaleY(-2, baseRect, 'S');

        chai.expect(insideRect).contain({ y: -100, height: 100 });
      });

      it('高度为参照矩形的 1/2，垂直缩放 -2 倍，缩放方向为 N', () => {
        insideRect.setScaleY(-2, baseRect, 'N');

        chai.expect(insideRect).contain({ y: 200, height: 100 });
      });
    });
  });

  describe('测试 getPointByDirection 方法', () => {
    it('测试矩形的上边', () => {
      const rectangle = new Rectangle(50, 50, 100, 100);
      const point = rectangle.getPointByDirection('N');
      chai.expect(point).contains({ x: 100, y: 50 });
    });

    it('测试矩形的右边', () => {
      const rectangle = new Rectangle(50, 50, 100, 100);
      const point = rectangle.getPointByDirection('E');
      chai.expect(point).contains({ x: 150, y: 100 });
    });

    it('测试矩形的下边', () => {
      const rectangle = new Rectangle(50, 50, 100, 100);
      const point = rectangle.getPointByDirection('S');
      chai.expect(point).contains({ x: 100, y: 150 });
    });

    it('测试矩形的左边', () => {
      const rectangle = new Rectangle(50, 50, 100, 100);
      const point = rectangle.getPointByDirection('W');
      chai.expect(point).contains({ x: 50, y: 100 });
    });
  });
});
