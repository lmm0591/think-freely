import { Provider } from 'react-redux';
import { Board } from './view/Board';
import { store } from './store';
import './Font.css';

export const App = () => {
  return (
    <Provider store={store}>
      <Board></Board>
    </Provider>
  );
};
