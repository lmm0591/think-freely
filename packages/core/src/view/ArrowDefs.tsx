import { memo } from 'react';

export const ArrowDefs = memo(() => {
  return (
    <defs>
      <marker id="think-freely-block" markerWidth="10" markerHeight="18" refX="9" refY="5" orient="auto">
        <path d="M0,0 L0,9 L10,5 Z" fill="block" stroke="currentColor"></path>
      </marker>
      <marker id="think-freely-blockThin" markerWidth="10" markerHeight="18" refX="9" refY="5" orient="auto">
        <path d="M0,0 L0,9 L10,5 Z" fill="white" stroke="currentColor"></path>
      </marker>
      <marker id="think-freely-open" markerHeight="9" markerWidth="9" refX="9" refY="4.5" orient="auto">
        <path d="M0,0 L9,4.5 L0,9" fill="none" style={{ stroke: 'currentColor' }}></path>
      </marker>
      <marker id="think-freely-oval" markerWidth="18" markerHeight="18" refX="9" refY="9" orient="auto">
        <ellipse cx="9" cy="9" rx="4.5" ry="4.5" fill="currentColor" stroke="currentColor"></ellipse>
      </marker>
      <marker id="think-freely-ovalThin" markerWidth="18" markerHeight="18" refX="9" refY="9" orient="auto">
        <ellipse cx="9" cy="9" rx="4.5" ry="4.5" fill="white" stroke="currentColor"></ellipse>
      </marker>
      <marker id="think-freely-diamond" markerWidth="18" markerHeight="14" refX="9" refY="6" orient="auto">
        <path d="M0,6 L9,12 L18,6 L9,0 Z" fill="block"></path>
      </marker>
      <marker id="think-freely-diamondThin" markerWidth="18" markerHeight="14" refX="9" refY="6" orient="auto">
        <path d="M0,6 L9,12 L18,6 L9,0 Z" fill="white" stroke="currentColor"></path>
      </marker>
    </defs>
  );
});
