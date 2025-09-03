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

  const btn =
    "inline-flex items-center h-9 px-3 rounded-md text-sm font-medium border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition focus:outline-none focus:ring-2 focus:ring-slate-400/50";

  return (
    <header className="mb-4 sm:mb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Gegenstand ausleihen
          </h1>
          <p className="text-slate-600 mt-1 text-sm sm:text-base">
            Schnell und unkompliziert Equipment reservieren
          </p>
        </div>

        <nav
          aria-label="Aktionen"
          className="flex flex-wrap items-center gap-2"
        >
          <a
            href="https://git.the1s.de/Matthias-Claudius-Schule/borrow-system/src/branch/dev/Docs/HELP.md"
            target="_blank"
            rel="noreferrer"
            className={btn}
          >
            Hilfe
          </a>
          <a
            href="https://git.the1s.de/Matthias-Claudius-Schule/borrow-system"
            target="_blank"
            rel="noreferrer"
            className={btn}
          >
            Source Code
          </a>
          <button type="button" onClick={passwordForm} className={btn}>
            Passwort ändern
          </button>
          <button
            type="button"
            onClick={onLogout}
            className={`${btn} border-rose-300 hover:bg-rose-50`}
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
