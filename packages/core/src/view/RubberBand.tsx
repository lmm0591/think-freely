import { Rectangle } from '../model/Rectangle';

export const RubberBand = ({ rect }: { rect?: Rectangle }) => {
  if (!rect) {
    return <></>;
  }
  return (
    <div
      className="mxRubberBand"
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        overflow: 'hidden',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: '#4e9deb',
        left: '0px',
        top: '0px',
        width: rect.width,
        height: rect.height,
        background: 'rgba(78, 157, 235, 0.1)',
        transform: `translate3d(${rect.x}px, ${rect.y}px, 0)`,
      }}
    ></div>
  );
};
