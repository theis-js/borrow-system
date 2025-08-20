import "./App.css";
import Layout from "./layout/Layout";
import { useEffect, useState } from "react";
import Form1 from "./components/Form1";
import Form2 from "./components/Form2";
import Form4 from "./components/Form4";
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
      <div className="space-y-6">
        <Form1 />
        <div className="h-px bg-slate-200" />
        <Form2 />
        <div className="h-px bg-slate-200" />
        <Form4 />
      </div>
    </Layout>
  ) : (
    <LoginForm onLogin={() => setIsLoggedIn(true)} />
  );
}

export default App;
