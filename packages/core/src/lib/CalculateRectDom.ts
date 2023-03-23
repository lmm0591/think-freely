import { CellStyle } from '../store/type/Cell';

const calculateRectDom = document.createElement('div');
calculateRectDom.style.display = 'inline-block';
calculateRectDom.style.lineHeight = '1.2';
calculateRectDom.style.wordBreak = 'break-word';
calculateRectDom.style.zIndex = '9';

export const CalculateRectDom = (text: string = '', style: CellStyle = {}): { width: number; height: number } => {
  document.body.appendChild(calculateRectDom);
  calculateRectDom.innerHTML = text;
  calculateRectDom.style.fontSize = `${style.fontSize}px`;
  const { width, height } = calculateRectDom.getBoundingClientRect();
  calculateRectDom.remove();
  return { width, height };
};
