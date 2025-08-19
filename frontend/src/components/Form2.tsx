import React from "react";
import Cookies from "js-cookie";
import { createLoan, addToRemove, rmFromRemove } from "../utils/userHandler";
import { BORROWABLE_ITEMS_UPDATED_EVENT } from "../utils/fetchData";

interface BorrowItem {
  id: number;
  item_name: string;
  can_borrow_role: string;
  inSafe: number;
}

const LOCAL_STORAGE_KEY = "borrowableItems";

function normalizeBorrowable(data: any): BorrowItem[] {
  const rawArr = Array.isArray(data)
    ? data
    : Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data?.data)
    ? data.data
    : [];

  return rawArr
    .map((raw: any) => {
      const idRaw =
        raw.id ?? raw.item_id ?? raw.itemId ?? raw.itemID ?? raw.itemIdPk;
      const id = Number(idRaw);
      const item_name = String(raw.item_name ?? raw.name ?? raw.title ?? "");
      const can_borrow_role = String(
        raw.can_borrow_role ?? raw.role ?? raw.requiredRole ?? ""
      );
      const inSafeRaw =
        raw.inSafe ?? raw.in_safe ?? raw.inLocker ?? raw.isInSafe ?? raw.safe;
      const inSafe =
        typeof inSafeRaw === "boolean"
          ? Number(inSafeRaw)
          : Number(isNaN(Number(inSafeRaw)) ? 0 : Number(inSafeRaw));

      if (!Number.isFinite(id) || !item_name) return null;
      return { id, item_name, can_borrow_role, inSafe };
    })
    .filter(Boolean) as BorrowItem[];
}

function useBorrowableItems() {
  const [items, setItems] = React.useState<BorrowItem[]>([]);

  const readFromStorage = React.useCallback(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY) || "[]";
      const parsed = JSON.parse(raw);
      const arr = normalizeBorrowable(parsed);
      setItems(arr);
    } catch {
      setItems([]);
    }
  }, []);

  React.useEffect(() => {
    readFromStorage();

    const onStorage = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY) readFromStorage();
    };
    window.addEventListener("storage", onStorage);

    const onBorrowableUpdated = () => readFromStorage();
    window.addEventListener(
      BORROWABLE_ITEMS_UPDATED_EVENT,
      onBorrowableUpdated
    );

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(
        BORROWABLE_ITEMS_UPDATED_EVENT,
        onBorrowableUpdated
      );
    };
  }, [readFromStorage]);

  return items;
}

const Form2: React.FC = () => {
  const items = useBorrowableItems();

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-slate-900">
        2. Gegenstand auswählen
      </h2>

      {items.length === 0 ? (
        <div className="text-slate-700 text-center bg-slate-100 border border-slate-200 rounded-xl p-4">
          Keine Gegenstände verfügbar für diesen Zeitraum.
        </div>
      ) : (
        <>
          {/* Mobile: card list */}
          <div className="sm:hidden space-y-2">
            {items.map((item) => (
              <label
                key={item.id}
                htmlFor={`item-${item.id}`}
                className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 bg-white shadow-sm"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">
                    {item.item_name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {item.inSafe ? "Verfügbar" : "Nicht im Schließfach"}
                  </div>
                </div>
                <input
                  type="checkbox"
                  id={`item-${item.id}`}
                  onChange={(e) => {
                    if (e.target.checked) addToRemove(item.id);
                    else rmFromRemove(item.id);
                  }}
                  className="h-5 w-5 accent-indigo-600"
                />
              </label>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700">
                    Gegenstand
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700">
                    <input type="checkbox" className="invisible" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2 text-sm font-medium text-slate-900">
                      {item.item_name}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-700 text-right">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) addToRemove(item.id);
                          else rmFromRemove(item.id);
                        }}
                        id={`item-${item.id}`}
                        className="h-4 w-4 accent-indigo-600"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <button
          onClick={() => {
            createLoan(
              Cookies.get("startDate") ?? "",
              Cookies.get("endDate") ?? ""
            );
          }}
          type="button"
          className="w-full sm:w-44 bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Ausleihen
        </button>
      </div>
    </div>
  );
};

export default Form2;
