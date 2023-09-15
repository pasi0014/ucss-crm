import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { AuthProvider } from 'react-auth-kit';
import StatusContextProvider from './context/StatusContext';
import theme from './theme';
import App from './App';

import './index.scss';
import { AppProvider } from './context/AppContext';
import refreshApi from './utils/refreshApi';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ChakraProvider>
    <AuthProvider authType={'cookie'} authName="_auth" cookieDomain={window.location.hostname} cookieSecure={true}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <AppProvider>
        <App />
      </AppProvider>
    </AuthProvider>
  </ChakraProvider>,
);
