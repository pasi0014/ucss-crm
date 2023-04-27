import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { AuthProvider } from "./context/AuthContext";
import StatusContextProvider from "./context/StatusContext";
import theme from "./theme";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <AuthProvider>
        <StatusContextProvider>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App />
        </StatusContextProvider>
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);
