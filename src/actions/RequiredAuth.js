import { useLocation, Navigate, Outlet } from "react-router-dom";

const RequireAuth = ({ allowedRoles }) => {
  const location = useLocation();
//   const { roles } = useAuth();
  const user = JSON.parse(localStorage.getItem("user"));

//   const content = roles.some((role) => allowedRoles.includes(role)) ? (
  const content = user && user.active ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );

  return content;
};
export default RequireAuth;
