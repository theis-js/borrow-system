import "./App.css";
import Layout from "./layout/Layout";
import { useEffect, useState } from "react";
import Form1 from "./components/Form1";
import Form2 from "./components/Form2";
import Form3 from "./components/Form3";
import LoginForm from "./components/LoginForm";
import Cookies from "js-cookie";
import { ToastContainer } from "react-toastify";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (Cookies.get("token")) {
      setIsLoggedIn(true);
    }

    localStorage.setItem("borrowableItems", JSON.stringify([]));
    localStorage.setItem("borrowCode", "123456");
  }, []);

  // Mock flow without real logic: show the three sections stacked for design preview
  return isLoggedIn ? (
    <Layout>
      <div className="space-y-10">
        <Form1 />
        <div className="h-px bg-blue-100" />
        <Form2 />
        <div className="h-px bg-blue-100" />
        <Form3 />
      </div>
    </Layout>
  ) : (
    <>
      <LoginForm onLogin={() => setIsLoggedIn(true)} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
        className="!z-50"
      />
    </>
  );
}

export default App;
