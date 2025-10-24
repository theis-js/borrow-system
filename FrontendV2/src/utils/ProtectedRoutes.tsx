import { Navigate, Outlet } from "react-router-dom";
import { useAtom } from "jotai";
import { setIsLoggedInAtom } from "@/states/Atoms";

export const ProtectedRoutes = () => {
  const [isLoggedIn] = useAtom(setIsLoggedInAtom);

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};
