import React from "react";

const Header: React.FC = () => {
  return (
    <header className="mb-6 md:mb-10">
      <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 tracking-tight drop-shadow-sm">
        Gegenstand ausleihen
      </h1>
      <p className="text-blue-500 mt-1 md:mt-2 text-base md:text-lg font-medium">
        Schnell und unkompliziert Equipment reservieren
      </p>
    </header>
  );
};

export default Header;
