import React, { createContext, useState, useEffect } from "react";
import { getStatuses } from "./calls";
import { useAuth } from "./AuthContext";

interface Status {
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
  const [statuses, setStatuses] = useState<Status[]>([]);
  const { token } = useAuth();

  const doGetStatuses = async () => {
    const response = await getStatuses();

    if (!response.success) {
      return response;
    }

    setStatuses(response.data);
  };

  useEffect(() => {
    if (token && token.length && statuses.length === 0) doGetStatuses();
  }, [token]);

  return (
    <StatusContext.Provider value={{ statuses }}>
      {children}
    </StatusContext.Provider>
  );
};

export default StatusContextProvider;
