import React from 'react';
import ReactDOM from 'react-dom/client';
import { EventEmitter } from 'eventemitter3';
import { CellActions } from './store/CellSlice';
import { CellData } from './store/type/Cell';
import { store } from './store';
import { App } from './App';

const emitter = new EventEmitter();
export const EmitterContext = React.createContext(emitter);

class ThinkFreely extends HTMLElement {
  getStore() {
    return store.getState().cell;
  }

  getSelectedCells() {
    const { selectedCellIds, map } = store.getState().cell;
    return selectedCellIds.map((id) => map[id]);
  }

  selectCells(cellIds: string[]) {
    store.dispatch(CellActions.selectDisplayCells(cellIds));
    emitter.emit('tf-select-cells', cellIds);
  }

  addCells(cells: Omit<CellData, 'type' | 'children'>[]) {
    cells.forEach((cell) => {
      store.dispatch(CellActions.addSticky(cell));
    });
  }

  connectedCallback() {
    const mountPoint = document.createElement('div');
    mountPoint.style.height = '100vh';
    this.attachShadow({ mode: 'open' }).appendChild(mountPoint);
    const root = ReactDOM.createRoot(mountPoint);

    emitter.on('tf-select-cells', (cellIds: string[]) => {
      this.dispatchEvent(new CustomEvent('tf-select-cells', { detail: { cellIds } }));
    });

    root.render(
      <React.StrictMode>
        <EmitterContext.Provider value={emitter}>
          <App />
        </EmitterContext.Provider>
      </React.StrictMode>,
    );
  }
}
if (!customElements.get('think-freely')) {
  customElements.define('think-freely', ThinkFreely);
}
