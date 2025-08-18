import React from "react";
import Object from "./Object";

const Sidebar: React.FC = () => {
  const items = JSON.parse(localStorage.getItem("allItems") || "[]");

  return (
    <aside className="w-full md:w-80 md:min-h-screen bg-white/90 backdrop-blur md:border-r border-blue-100 shadow-xl flex flex-col p-6">
      <h2 className="text-2xl font-extrabold mb-4 text-blue-700 tracking-tight flex items-center gap-2">
        <svg
          className="w-6 h-6 text-blue-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 7.5V4.75A2.25 2.25 0 0 0 14.25 2.5h-4.5A2.25 2.25 0 0 0 7.5 4.75V7.5m9 0h-9m9 0v11.75A2.25 2.25 0 0 1 14.25 21.5h-4.5A2.25 2.25 0 0 1 7.5 19.25V7.5m9 0h-9"
          />
        </svg>
        Ausleih-Übersicht
      </h2>

      <div className="space-y-4 flex-1 overflow-auto pr-1">
        {items.map((item: any) => (
          <div
            key={item.id}
            className="bg-white/80 rounded-xl p-4 shadow hover:shadow-md transition"
          >
            <Object title={item.title} description={item.description} />
          </div>
        ))}
      </div>

      <div className="mt-6 text-xs text-gray-400 flex items-center gap-4">
        <span className="inline-block w-3 h-3 bg-green-400 rounded-full"></span>
        Verfügbar
        <span className="inline-block w-3 h-3 bg-blue-400 rounded-full"></span>
        Verliehen
      </div>
    </aside>
  );
};

export default Sidebar;
