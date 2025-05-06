import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@ant-design/v5-patch-for-react-19';
import "./style/style.css";
import StartUp from './StartUp';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/auth.context';
import {Provider} from 'react-redux';
import store from './redux/store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
         <StartUp/>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  </StrictMode>,
)