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
import Landingpage from "./pages/Landingpage";
import { changeLanguage } from "i18next";
import { Box, Flex } from "@chakra-ui/react";
import { Footer } from "./components/footer/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { API_BASE } from "@/config/api.config";
import { NotFoundPage } from "./pages/NotFoundPage";

const queryClient = new QueryClient();

function App() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [, setIsLoggedIn] = useAtom(setIsLoggedInAtom);
  const [, setTriggerLogout] = useAtom(triggerLogoutAtom);

  useEffect(() => {
    if (Cookies.get("token")) {
      const verifyToken = async () => {
        const response = await fetch(`${API_BASE}/verify`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        if (response.ok) {
          setTriggerLogout(false);
          const data = await response.json();
          setUser({
            username: data.user.username,
            is_admin: data.user.is_admin,
            first_name: data.user.first_name,
            last_name: data.user.last_name,
            role: data.user.role,
          });
          setIsLoggedIn(true);
        } else {
          Cookies.remove("token");
          setIsLoggedIn(false);
          window.location.reload();
        }
      };
      verifyToken();
    }

    // set initial language
    if (!Cookies.get("language")) {
      const getBrowserLanguage = () => {
        const lang = navigator.languages?.[0] || navigator.language || "en";
        return lang.split("-")[0].toLowerCase();
      };

      changeLanguage(getBrowserLanguage());
      Cookies.set("language", getBrowserLanguage());
    }

    if (Cookies.get("language")) {
      changeLanguage(Cookies.get("language") || "en");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Flex direction="column" minH="100vh">
        <Box as="main" flex="1">
          <UserContext.Provider value={user}>
            <BrowserRouter>
              <Routes>
                <Route element={<ProtectedRoutes />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/my-loans" element={<MyLoansPage />} />
                  <Route path="/landingpage" element={<Landingpage />} />
                </Route>

                <Route path="/login" element={<LoginPage />} />
                <Route path="/not-found" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </UserContext.Provider>
        </Box>
        <Footer />
      </Flex>
    </QueryClientProvider>
  );
}

export default App;
