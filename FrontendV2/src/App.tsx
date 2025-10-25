import "./App.css";
import { LoginPage } from "@/pages/LoginPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { ProtectedRoutes } from "./utils/ProtectedRoutes";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useAtom } from "jotai";
import { setIsLoggedInAtom } from "@/states/Atoms";
import { UserContext, type User } from "./states/Context";
import { triggerLogoutAtom } from "@/states/Atoms";
import { MyLoansPage } from "./pages/MyLoansPage";

const API_BASE =
  (import.meta as any).env?.VITE_BACKEND_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:8002";

function App() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [, setIsLoggedIn] = useAtom(setIsLoggedInAtom);
  const [, setTriggerLogout] = useAtom(triggerLogoutAtom);

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
          setTriggerLogout(false);
          const data = await response.json();
          setUser({ username: data.user.username, role: data.user.role });
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

  return (
    <>
      <UserContext.Provider value={user}>
        <BrowserRouter>
          <Routes>
            <Route element={<ProtectedRoutes />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/my-loans" element={<MyLoansPage />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </>
  );
}

export default App;
