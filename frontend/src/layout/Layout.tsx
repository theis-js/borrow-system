import React from "react";
import "../App.css";
import { ToastContainer } from "react-toastify";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-50 via-white to-blue-100">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center py-10 px-4 md:py-14">
        <div className="w-full max-w-3xl">
          <Header />
        </div>
        <div className="w-full max-w-3xl bg-white/90 shadow-2xl rounded-3xl p-6 md:p-10 ring-1 ring-blue-100">
          {children}
        </div>
      </main>

      {/* Mobile sidebar at bottom */}
      <div className="fixed bottom-4 left-4 right-4 md:hidden z-10">
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl ring-1 ring-blue-100 p-4">
          <Sidebar />
        </div>
      </div>

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
    </div>
  );
};

export default Layout;
