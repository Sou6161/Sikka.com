import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './app/store';
import "./index.css";
import { BrowserRouter } from 'react-router-dom';
import RoutesConfig from './Routes/Routes';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <RoutesConfig />
    </BrowserRouter>
  </Provider>
);