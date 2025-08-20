import React from "react";
import "../App.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

type LayoutProps = {
  children: React.ReactNode;
  onLogout: () => void;
};

const Layout: React.FC<LayoutProps> = ({ children, onLogout }) => {
  return (
    <div className="h-screen overflow-hidden flex bg-slate-50 text-slate-800">
      {/* Main */}
      <main className="flex-1 min-h-0 overflow-hidden flex flex-col items-center px-3 sm:px-5 py-4 sm:py-8">
        {/* Sidebar on mobile appears inline on top; on desktop it's a sticky column */}
        <div className="w-full max-w-5xl md:flex md:gap-6 md:items-stretch md:min-h-0 md:h-full">
          <div className="block md:hidden mb-3">
            <Sidebar />
          </div>

          <div className="hidden md:flex md:flex-col md:shrink-0 md:w-72 md:min-h-0 md:h-full">
            <Sidebar />
          </div>

          <div className="flex-1 min-w-0 md:min-h-0 md:h-full flex flex-col overflow-hidden">
            <div className="w-full">
              <Header onLogout={onLogout} />
            </div>
            <div className="w-full bg-white shadow-md md:shadow-lg rounded-2xl p-4 sm:p-6 ring-1 ring-slate-200 flex-1 min-h-0 overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
