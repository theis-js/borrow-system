import React, { useState } from "react";
import { useEffect } from "react";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Cookies from "js-cookie";
import Landingpage from "@/components/API/Landingpage";

const Layout: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAPI, setShowAPI] = useState(false);

  useEffect(() => {
    const path = window.location.pathname.replace(/\/+$/, ""); // remove trailing slash
    if (path === "/api") {
      setShowAPI(true);
      console.log("signal");
      return;
    }

    if (Cookies.get("token")) {
      const verifyToken = async () => {
        const response = await fetch("http://localhost:8002/api/verifyToken", {
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

  const handleLogout = () => {
    Cookies.remove("token");
    window.location.pathname = "/";
    setIsLoggedIn(false);
  };

  if (showAPI) {
    return (
      <main>
        <Landingpage />
      </main>
    );
  }

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
