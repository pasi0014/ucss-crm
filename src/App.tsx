import { useEffect } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import SidebarWithHeader from "./components/SidebarWithHeader";
import RegisterForm from "./components/RegisterForm";
import Login from "./containers/Login";

import "./App.css";
import { Home } from "./containers/Home";
import Dashboard from "./containers/Dashboard";
import ProtectedRoute from "./routers/ProtectedRoute";
import Donors from "./containers/Donors";

function App() {
  const { token } = useAuth();

  return (
    <BrowserRouter>
      {token ? (
        <>
          <SidebarWithHeader>
            <Routes>
              <Route path="/" element={<ProtectedRoute element={<Home />} />} />
              <Route
                path="/dashboard"
                element={<ProtectedRoute element={<Dashboard />} />}
              />
              <Route
                path="/donors"
                element={<ProtectedRoute element={<Donors />} />}
              />
              <Route path="/login" element={<Navigate to="/" replace />} />
            </Routes>
          </SidebarWithHeader>
        </>
      ) : (
        <Routes>
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
