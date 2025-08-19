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
    handler();
    window.addEventListener(ALL_ITEMS_UPDATED_EVENT, handler);
    return () => window.removeEventListener(ALL_ITEMS_UPDATED_EVENT, handler);
  }, []);

  const outCount = items.reduce((n, it) => n + (it.inSafe ? 0 : 1), 0);
  const sorted = [...items].sort((a, b) => Number(a.inSafe) - Number(b.inSafe));

  return (
    <aside className="w-full md:w-72 md:h-[calc(100vh-2rem)] md:sticky md:top-4 overflow-y-auto bg-white rounded-2xl p-3 sm:p-4 ring-1 ring-slate-200 shadow-sm">
      <h2 className="text-lg sm:text-xl font-bold mb-3 text-slate-900 tracking-tight flex items-center justify-between">
        <span className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-slate-700"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
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
          <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
            {outCount} außerhalb
          </span>
        )}
      </h2>

      {/* Mobile: horizontal scroll, Desktop: vertical list */}
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1 -mr-1 pr-2 md:block md:space-y-3 md:pr-1">
        {sorted.map((item: any) => (
          <div
            key={item.item_name}
            className={`bg-white rounded-xl p-3 sm:p-4 ring-1 ring-slate-200 hover:ring-slate-300 transition ${
              item.inSafe ? "" : "ring-red-200"
            } shrink-0 snap-start min-w-[240px] md:min-w-0`}
          >
            <div className="flex items-start gap-3">
              <span className="relative mt-0.5 inline-flex" aria-hidden="true">
                {!item.inSafe && (
                  <span className="absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75 animate-ping"></span>
                )}
                <span
                  className={`inline-block w-3 h-3 rounded-full ${
                    item.inSafe ? "bg-emerald-500" : "bg-red-500"
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

      <div className="mt-3 text-[10px] sm:text-xs text-slate-500 items-center gap-4 hidden md:flex">
        <span className="inline-block w-3 h-3 bg-emerald-500 rounded-full"></span>
        Verfügbar
        <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
        Außerhalb des Schließfachs
      </div>
    </aside>
  );
};

export default Sidebar;
