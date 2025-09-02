import React, { useState } from "react";
import { useEffect } from "react";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Cookies from "js-cookie";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (Cookies.get("token")) {
      const verifyToken = async () => {
        const response = await fetch("https://backend.insta.the1s.de/api/verifyToken", {
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
    setIsLoggedIn(false);
  };

  return (
    <>
      <main>
        {isLoggedIn ? (
          <Dashboard onLogout={() => handleLogout()} />
        ) : (
          <Login onSuccess={() => setIsLoggedIn(true)} />
        )}
      </main>
      {children}
    </>
  );
};

export default Layout;
