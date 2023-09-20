import { Spinner } from '@chakra-ui/react';
import { createContext, useState } from 'react';
import { Center } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import LoadingPage from '../components/LoadingPage';

export const AppContext = createContext({});

export const AppProvider = ({ children }: any) => {
  const [appLoading, setAppLoading] = useState(false);

  const appContext = {
    appLoading,
    setAppLoading,
  } as any;

  return (
    <AppContext.Provider value={appContext}>
      {children}

      {appLoading && <LoadingPage />}
    </AppContext.Provider>
  );
};
