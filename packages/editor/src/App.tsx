import { WhiteBoard } from '@tf/core';
import { ToolBar } from './view/Tool';

export function App() {
  return (
    <div style={{ height: '100vh' }}>
      <div style={{ position: 'fixed', left: 0 }}>
        <ToolBar></ToolBar>
      </div>
      <WhiteBoard></WhiteBoard>
    </div>
  );
}
