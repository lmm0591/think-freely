import { CalculateHeightDom, CalculateWidthDom } from './CalculateRectDom';
import '../Font.css';

function loadFont(family: string = 'cascadia') {
  const font = [...document.fonts.values()].find((font) => font.family === family);
  return font?.load();
}

describe('测试计算字体大小场景', () => {
  before((done) => {
    loadFont()?.then(() => done());
  });

  describe('测试 CalculateHeightDom', () => {
    it('单行文本时获取高度', () => {
      const height = CalculateHeightDom(100, 'Hello World', { fontSize: 12 });
      chai.expect(height).eql(18);
    });

    it('多行文本时获取高度', () => {
      const height = CalculateHeightDom(100, 'Hello World, Hello World, Hello World', { fontSize: 12 });
      chai.expect(height).eql(54);
    });
  });

  describe('测试 CalculateWidthDom', () => {
    it('获取文字的宽度', () => {
      const width = CalculateWidthDom('Hello World', { fontSize: 12 });
      chai.expect(Math.ceil(width)).eql(78);
    });

    it('不同的字号会影响文字的宽度', () => {
      const width = CalculateWidthDom('Hello World', { fontSize: 20 });
      chai.expect(Math.ceil(width)).eql(129);
    });
  });
});
