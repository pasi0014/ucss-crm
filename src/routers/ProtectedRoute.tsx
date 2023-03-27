import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface AllowedRolesProps {
  allowedRoles?: string;
}

const ProtectedRoute = (props: any) => {
  const { token } = useAuth();
  const location = useLocation();

  return token ? (
    props.element
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );

  // Role based stuff
  // return user?.roles?.find((role: any) => allowedRoles?.includes(role)) ? (
  //   <Outlet />
  // ) : user?.user ? (
  //   <Navigate to="/unauthorized" state={{ from: location }} replace />
  // ) : (
  //   <Navigate to="/login" state={{ from: location }} replace />
  // );
};

export default ProtectedRoute;
