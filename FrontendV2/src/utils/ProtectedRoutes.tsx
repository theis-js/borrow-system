import { Outlet, Navigate } from "react-router-dom";
import { useAtom } from "jotai";
import { setIsLoggedInAtom } from "@/states/Atoms";
import { useEffect } from "react";
import Cookies from "js-cookie";

const API_BASE =
  (import.meta as any).env?.VITE_BACKEND_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:8002";

export const ProtectedRoutes = () => {
  const [isLoggedIn, setIsLoggedIn] = useAtom(setIsLoggedInAtom);

  useEffect(() => {
    if (Cookies.get("token")) {
      const verifyToken = async () => {
        const response = await fetch(`${API_BASE}/api/verifyToken`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          Cookies.remove("token");
          setIsLoggedIn(false);
          window.location.reload();
        }
      };
      verifyToken();
    }
  }, []);

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};
