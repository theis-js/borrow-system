import React, { useEffect, useState } from "react";
import Object from "./Object";
import { ALL_ITEMS_UPDATED_EVENT } from "../utils/fetchData";

const Sidebar: React.FC = () => {
  const [items, setItems] = useState<any[]>(
    JSON.parse(localStorage.getItem("allItems") || "[]")
  );

  useEffect(() => {
    const handler = () => {
      const next = JSON.parse(localStorage.getItem("allItems") || "[]");
      setItems(next);
    };
    // Update immediately in case data changed before this mounted
    handler();
    window.addEventListener(ALL_ITEMS_UPDATED_EVENT, handler);
    return () => window.removeEventListener(ALL_ITEMS_UPDATED_EVENT, handler);
  }, []);

  const outCount = items.reduce((n, it) => n + (it.inSafe ? 0 : 1), 0);
  const sorted = [...items].sort((a, b) => Number(a.inSafe) - Number(b.inSafe)); // außerhalb zuerst

  return (
    <aside className="w-full md:w-80 md:h-screen md:sticky md:top-0 overflow-y-auto bg-white/90 backdrop-blur md:border-r border-blue-100 shadow-xl flex flex-col p-6">
      <h2 className="text-2xl font-extrabold mb-4 text-blue-700 tracking-tight flex items-center justify-between">
        <span className="flex items-center gap-2">
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
          Geräte Übersicht
        </span>
        {outCount > 0 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
            {outCount} außerhalb
          </span>
        )}
      </h2>

      <div className="space-y-4 flex-1 pr-1">
        {sorted.map((item: any) => (
          <div
            key={item.item_name}
            className={`bg-white/80 rounded-xl p-4 shadow hover:shadow-md transition ${
              item.inSafe ? "" : "ring-1 ring-red-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="relative mt-1 inline-flex" aria-hidden="true">
                {!item.inSafe && (
                  <span className="absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75 animate-ping"></span>
                )}
                <span
                  className={`inline-block w-3 h-3 rounded-full ${
                    item.inSafe ? "bg-green-400" : "bg-red-500"
                  }`}
                  title={
                    item.inSafe ? "Im Schließfach" : "Nicht im Schließfach"
                  }
                  aria-label={
                    item.inSafe ? "Im Schließfach" : "Nicht im Schließfach"
                  }
                />
              </span>
              <Object
                title={item.item_name}
                description={
                  item.inSafe ? "Im Schließfach" : "Nicht im Schließfach"
                }
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-xs text-gray-400 flex items-center gap-4">
        <span className="inline-block w-3 h-3 bg-green-400 rounded-full"></span>
        Verfügbar
        <span className="inline-block w-3 h-3 bg-red-400 rounded-full"></span>
        Außerhalb des Schließfachs
      </div>
    </aside>
  );
};

export default Sidebar;
