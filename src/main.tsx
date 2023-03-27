import React from "react";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import theme from "./theme";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./containers/Dashboard";
import { Home } from "./containers/Home";
import SidebarWithHeader from "./components/SidebarWithHeader";

// const AppLayout = () => {
//   return (
//     <>
//       <SidebarWithHeader>
//         <Outlet />
//       </SidebarWithHeader>
//     </>
//   );
// };

// const router = createBrowserRouter([
//   {
//     element: <AppLayout />,
//     children: [
//       {
//         path: "/",
//         element: <Home />,
//       },
//       {
//         path: "dashboard",
//         element: <Dashboard />,
//       },
//     ],
//   },
// ]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <AuthProvider>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);
