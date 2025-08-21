import React from "react";

type HeaderProps = {
  onLogout: () => void;
};

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="mb-4 sm:mb-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Gegenstand ausleihen
          </h1>
          <p className="text-slate-600 mt-1 text-sm sm:text-base">
            Schnell und unkompliziert Equipment reservieren
          </p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="h-9 px-3 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
        >
          Logout
        </button>
        <a href="https://git.the1s.de/Matthias-Claudius-Schule/borrow-system/src/branch/dev/Docs/HELP.md">
          <button className="h-9 px-3 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 transition">
            Hilfe
          </button>
        </a>
      </div>
    </header>
  );
};

export default Header;
