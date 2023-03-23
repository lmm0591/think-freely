import { CellStyle } from '../store/type/Cell';

const calculateRectDom = document.createElement('div');
calculateRectDom.style.display = 'inline-block';
calculateRectDom.style.lineHeight = '1.5';
calculateRectDom.style.wordBreak = 'break-word';
calculateRectDom.style.zIndex = '9';

export const CalculateHeightDom = (width: number, text: string = '', style: CellStyle = {}): number => {
  document.body.appendChild(calculateRectDom);
  calculateRectDom.innerHTML = text;
  calculateRectDom.style.fontSize = `${style.fontSize}px`;
  calculateRectDom.style.width = `${width}px`;
  calculateRectDom.style.whiteSpace = '';
  calculateRectDom.style.wordBreak = 'break-all';
  calculateRectDom.style.wordWrap = 'break-word';
  const { height } = calculateRectDom.getBoundingClientRect();
  calculateRectDom.remove();
  return height;
};

export const CalculateWidthDom = (text: string = '', style: CellStyle = {}): number => {
  document.body.appendChild(calculateRectDom);
  calculateRectDom.innerHTML = text;
  calculateRectDom.style.fontSize = `${style.fontSize}px`;
  calculateRectDom.style.width = '';
  calculateRectDom.style.whiteSpace = 'nowrap';
  calculateRectDom.style.wordBreak = '';
  calculateRectDom.style.wordWrap = '';
  const { width } = calculateRectDom.getBoundingClientRect();
  calculateRectDom.remove();
  return width;
};
