import { Provider } from 'react-redux';
import { Board } from './view/Board';
import { store } from './store';

export const App = () => {
  return (
    <Provider store={store}>
      <Board></Board>
    </Provider>
  );
};
