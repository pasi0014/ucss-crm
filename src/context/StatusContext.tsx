import { createContext, useState, useEffect, useContext } from 'react';
import { getStatuses } from './calls';
import { useSignOut } from 'react-auth-kit';
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
  const [statuses, setStatuses] = useState<any>(null);

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
      const statusObj = {} as any;

      response.data.content.forEach((status: any) => {
        if (!statusObj[status.entity]) {
          statusObj[status.entity] = {};
        }
        statusObj[status.entity][status.value] = status.id;
      });

      setStatuses(statusObj);
    } catch (error: any) {
      console.error('Unexpected Error: ', { ...error });
    }

    setAppLoading(false);
  };

  useEffect(() => {
    if (!statuses) {
      doGetStatuses();
    }
  }, [statuses]);

  return <StatusContext.Provider value={{ statuses }}>{children}</StatusContext.Provider>;
};

export default StatusContextProvider;
