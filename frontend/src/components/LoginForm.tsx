import React from "react";
import Footer from "./Footer";
import { useState } from "react";
import { loginUser } from "../utils/fetchData";
import { myToast } from "../utils/toastify";

type LoginFormProps = {
  onLogin: () => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await loginUser(username, password);
    if (result.success) {
      onLogin();
    } else {
      myToast("Login failed. Please check your credentials.", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              id="username"
              className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2.5 bg-white"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2.5 bg-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-md shadow hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default LoginForm;
