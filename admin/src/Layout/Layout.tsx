import React, { useState } from "react";
import { useEffect } from "react";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Cookies from "js-cookie";
import { API_BASE } from "@/config/api.config";

const Layout: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (Cookies.get("token")) {
      const verifyToken = async () => {
        const response = await fetch(
          `${API_BASE}/api/admin/user-mgmt/verify-token`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
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

  const handleLogout = () => {
    Cookies.remove("token");
    window.location.pathname = "/";
    setIsLoggedIn(false);
  };

  return (
    <main>
      {isLoggedIn ? (
        <Dashboard onLogout={() => handleLogout()} />
      ) : (
        <Login onSuccess={() => setIsLoggedIn(true)} />
      )}
    </main>
  );
};

export default Layout;
