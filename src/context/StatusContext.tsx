import React, { createContext, useState, useEffect, useContext, useLayoutEffect } from 'react';
import { getStatuses, valdiateToken } from './calls';
import { useAuthUser, useIsAuthenticated, useSignOut } from 'react-auth-kit';
import { AppContext } from './AppContext';

export interface Status {
  id: number;
  entity: string;
  value: string;
}

interface AppContextProps {
  statuses: Status[];
}

export const StatusContext = createContext<AppContextProps>({
  statuses: [],
});

const StatusContextProvider = ({ children }: any) => {
  const isAuthenticated = useIsAuthenticated();
  const [statuses, setStatuses] = useState<Status[]>([]);
  const { setAppLoading } = useContext<any>(AppContext);

  const signOut = useSignOut();

  const doGetStatuses = async () => {
    setAppLoading(true);

    try {
      const response = await getStatuses();

      if (response.resStatus === 401) {
        setAppLoading(false);
        signOut();
      }

      if (!response.success) {
        return response;
      }
      const temp = {} as any;
      response.data.content.forEach((status: any) => {
        if (!temp[status.entity]) {
          temp[status.entity] = {};
        }
        temp[status.entity][status.value] = status.id;
      });
      setStatuses(temp);
    } catch (error: any) {
      console.error('Unexpected Error: ', { ...error });
    }

    setAppLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated()) {
      doGetStatuses();
    }
  }, []);

  return <StatusContext.Provider value={{ statuses }}>{children}</StatusContext.Provider>;
};

export default StatusContextProvider;
