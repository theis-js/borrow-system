import React, { useEffect, useState } from "react";
import Object from "./Object";
import { MonitorSmartphone } from "lucide-react";
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
    <aside className="w-full md:w-72 md:h-full flex flex-col rounded-2xl pt-0 px-3 pb-3 sm:pt-0 sm:px-4 sm:pb-4 bg-gradient-to-b from-white to-slate-50 ring-1 ring-slate-200/70 shadow-md overflow-hidden">
      <div className="sticky top-0 z-10 -mx-3 sm:-mx-4 px-3 sm:px-4 py-2.5 bg-white/85 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-b border-slate-200/70 text-lg sm:text-xl font-bold mb-3 text-slate-900 tracking-tight flex items-center justify-between gap-2 rounded-t-2xl">
        <span className="flex items-center gap-2 min-w-0 flex-1 truncate">
          <MonitorSmartphone className="w-5 h-5 text-slate-700 shrink-0" />
          <span className="truncate">Geräte</span>
        </span>
        {outCount > 0 && (
          <span className="inline-flex items-center gap-1 whitespace-nowrap tabular-nums text-[10px] sm:text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200/70 shadow-sm font-medium">
            {outCount} außerhalb
          </span>
        )}
      </div>

      {/* Scroll area */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mr-1 pr-2 md:block md:space-y-3 md:pr-1 md:pb-1">
          {sorted.map((item: any) => (
            <div
              key={item.item_name}
              className={`group relative bg-white rounded-xl p-3 sm:p-4 ring-1 ring-slate-200/70 uration-200 hover:shadow-md focus-within:ring-slate-300 ${
                item.inSafe
                  ? "border-l-4 border-emerald-400"
                  : "border-l-4 border-red-400 ring-red-200/60 bg-red-50/40"
              } shrink-0 snap-start min-w-[240px] md:min-w-0`}
            >
              <div className="flex items-start gap-3">
                <span
                  className="relative mt-0.5 inline-flex"
                  aria-hidden="true"
                >
                  {!item.inSafe && (
                    <span className="absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75 animate-ping"></span>
                  )}
                  <span
                    className={`inline-block w-3 h-3 rounded-full ring-2 ring-white ${
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

        <div className="mt-4 pt-3 border-t border-slate-200/70 text-[10px] sm:text-xs text-slate-500 items-center gap-4 hidden md:flex">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white shadow-sm"></span>
            Verfügbar
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block w-3 h-3 bg-red-500 rounded-full ring-2 ring-white shadow-sm"></span>
            Außerhalb des Schließfachs
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
