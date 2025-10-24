import "./App.css";
import { LoginPage } from "@/pages/LoginPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { ProtectedRoutes } from "./utils/ProtectedRoutes";

const API_BASE =
  (import.meta as any).env?.VITE_BACKEND_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:8002";

function App() {
  return (
    <>
      <div>Layout Component</div>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<HomePage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
