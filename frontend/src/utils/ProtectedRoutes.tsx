import { Navigate, Outlet, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { useContext } from "react";
import { UserContext } from "@/states/Context";

export const ProtectedRoutes = () => {
  const user = useContext(UserContext);
  const location = useLocation();
  const hasToken = Boolean(Cookies.get("token"));

  if (hasToken && !user) {
    return null;
  }

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};
