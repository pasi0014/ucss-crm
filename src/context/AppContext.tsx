import { Spinner } from "@chakra-ui/react";
import { createContext, useState, useEffect } from "react";

export const AppContext = createContext({});

export const AppProvider = ({ children }: any) => {
  const [appLoading, setAppLoading] = useState(false);

  const appContext = {
    appLoading,
    setAppLoading,
  } as any;

  // Block all clicks when app is loading
  useEffect(() => {
    document.body.classList.remove("is-loading");

    if (appLoading) {
      document.body.classList.add("is-loading");
    }
  }, [appLoading]);

  return (
    <AppContext.Provider value={appContext}>
      {children}

      {appLoading && (
        <div className=" loading_screen loading_screen--fullscreen">
          <Spinner size="md" />
        </div>
      )}
    </AppContext.Provider>
  );
};
