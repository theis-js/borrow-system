import React from "react";
import { changePW } from "../utils/userHandler";
import { myToast } from "../utils/toastify";

type HeaderProps = {
  onLogout: () => void;
};

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const passwordForm = () => {
    const oldPW = window.prompt("Altes Passwort");
    const newPW = window.prompt("Neues Passwort");
    const repeatNewPW = window.prompt("Neues Passwort wiederholen");
    if (oldPW && newPW && repeatNewPW) {
      if (newPW === repeatNewPW) {
        changePW(oldPW, newPW);
      } else {
        myToast("Die neuen Passwörter stimmen nicht überein.", "error");
      }
    } else {
      myToast("Bitte alle Felder ausfüllen.", "error");
    }
  };

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
        <a href="https://git.the1s.de/Matthias-Claudius-Schule/borrow-system">
          <button className="h-9 px-3 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 transition">
            Source Code
          </button>
        </a>
        <button
          type="button"
          onClick={passwordForm}
          className="h-9 px-3 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
        >
          Passwort ändern
        </button>
      </div>
    </header>
  );
};

export default Header;
