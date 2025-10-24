import "./App.css";
import Layout from "./layout/Layout";
import { useEffect, useState } from "react";
import { AddLoan } from "./components/AddLoan";
import LoginForm from "./components/LoginForm";
import Cookies from "js-cookie";
import {
  fetchAllData,
  ALL_ITEMS_UPDATED_EVENT,
  AUTH_LOGOUT_EVENT,
} from "./utils/fetchData";
import { myToast } from "./utils/toastify";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setIsLoggedIn(true);
      fetchAllData(token);
    }
    localStorage.setItem("borrowableItems", JSON.stringify([]));
  }, []);

  useEffect(() => {
    const onAuthLogout = () => {
      setIsLoggedIn(false);
    };
    window.addEventListener(AUTH_LOGOUT_EVENT, onAuthLogout);
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, onAuthLogout);
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("allItems");
    localStorage.removeItem("allLoans");
    localStorage.removeItem("userLoans");
    localStorage.removeItem("borrowableItems");
    window.dispatchEvent(new Event(ALL_ITEMS_UPDATED_EVENT));
    myToast("Logged out successfully!", "success");
    setIsLoggedIn(false);
  };

  return isLoggedIn ? (
    <Layout onLogout={handleLogout}>
      <AddLoan />
    </Layout>
  ) : (
    <LoginForm onLogin={() => setIsLoggedIn(true)} />
  );
}

export default App;
