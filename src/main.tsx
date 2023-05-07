import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { AuthProvider } from 'react-auth-kit';
import StatusContextProvider from './context/StatusContext';
import theme from './theme';
import App from './App';

import './index.scss';
import { AppProvider } from './context/AppContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <ChakraProvider>
    <AuthProvider authType={'cookie'} authName="_auth" cookieDomain={window.location.hostname} cookieSecure={true}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <AppProvider>
        <StatusContextProvider>
          <App />
        </StatusContextProvider>
      </AppProvider>
    </AuthProvider>
  </ChakraProvider>,
  // </React.StrictMode>,
);
