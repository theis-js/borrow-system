import React from "react";

type HeaderProps = {
  onLogout: () => void;
};

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="mb-6 md:mb-10">
      <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 tracking-tight drop-shadow-sm">
        Gegenstand ausleihen
      </h1>
      <p className="text-blue-500 mt-1 md:mt-2 text-base md:text-lg font-medium">
        Schnell und unkompliziert Equipment reservieren
      </p>
      <button
        type="button"
        onClick={onLogout}
        className="text-blue-500 hover:underline"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
