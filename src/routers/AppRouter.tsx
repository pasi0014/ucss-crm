import React, { ComponentType } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Dashboard from "../containers/Dashboard";

import Login from "../containers/Login";
import PrivateRoute from "./ProtectedRoute";

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/donations" element={<Dashboard />} />
      <Route path="/dashboard" element={<Login />} />
      {/* <Route path="/contact" Component={ContactPage} /> */}
      {/* <Route component={NotFoundPage} /> */}
    </Routes>
  );
};

export default AppRouter;
