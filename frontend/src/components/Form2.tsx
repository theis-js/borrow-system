import React from "react";
import Cookies from "js-cookie";
import { createLoan } from "../utils/userHandler";
import { addToRemove, rmFromRemove } from "../utils/userHandler";
import { BORROWABLE_ITEMS_UPDATED_EVENT } from "../utils/fetchData";

interface BorrowItem {
  id: number;
  item_name: string;
  can_borrow_role: string;
  inSafe: number;
}

const LOCAL_STORAGE_KEY = "borrowableItems";

// Einfache Type-Guard/Validierung
const isBorrowItem = (v: any): v is BorrowItem =>
  v &&
  typeof v.id === "number" &&
  (typeof v.item_name === "string" || typeof v.name === "string") &&
  (typeof v.can_borrow_role === "string" || typeof v.role === "string");

// Helfer: unterschiedliche Server-Shapes normalisieren
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

// Hook, der automatisch aus dem Local Storage liest und auf Änderungen hört
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
    // Initial read
    readFromStorage();

    // Cross-tab updates
    const onStorage = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY) readFromStorage();
    };
    window.addEventListener("storage", onStorage);

    // Same-tab updates via Custom Event
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
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-blue-700">
        2. Gegenstand auswählen
      </h2>

      {items.length === 0 ? (
        <div className="text-red-600 font-medium text-center bg-red-50 border border-red-200 rounded-xl p-4">
          Keine Gegenstände verfügbar für diesen Zeitraum.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-blue-100 shadow-sm bg-white/80">
          <table className="min-w-full divide-y divide-blue-100">
            <thead className="bg-blue-50/60">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-blue-700">
                  Gegenstand
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-blue-700">
                  <input type="checkbox" className="invisible" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-blue-50/40 transition-colors"
                >
                  <td className="px-4 py-2 text-sm font-medium text-blue-900">
                    {item.item_name}
                  </td>
                  <td className="px-4 py-2 text-sm text-blue-700">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          addToRemove(item.id);
                        } else {
                          rmFromRemove(item.id);
                        }
                      }}
                      id={`item-${item.id}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={() => {
            createLoan(
              Cookies.get("startDate") ?? "",
              Cookies.get("endDate") ?? ""
            );
          }}
          type="button"
          className="flex-1 sm:flex-none sm:w-40 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-xl shadow transition"
        >
          Ausleihen
        </button>
      </div>
    </div>
  );
};

export default Form2;
