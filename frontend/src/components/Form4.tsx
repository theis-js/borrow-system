import React, { useEffect, useState } from "react";
import { Trash, ArrowLeftRight } from "lucide-react";
import { handleDeleteLoan } from "../utils/userHandler";

type Loan = {
  id: number;
  username: string;
  loan_code: number;
  start_date: string;
  end_date: string;
  take_date: string | null;
  returned_date: string | null;
  created_at: string;
  loaned_items_id: number[];
  loaned_items_name: string[];
};

const formatDate = (iso: string | null) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" });
};

const readUserLoansFromStorage = (): Loan[] => {
  const raw = localStorage.getItem("userLoans");
  if (!raw || raw === '"No loans found for this user"') return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Loan[]) : [];
  } catch {
    return [];
  }
};

const Form4: React.FC = () => {
  const [userLoans, setUserLoans] = useState<Loan[]>(() =>
    readUserLoansFromStorage()
  );

  // Keep in sync if localStorage changes (e.g., other tabs or parts of the app)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "userLoans") {
        setUserLoans(readUserLoansFromStorage());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const onDelete = async (loanID: number) => {
    const ok = await handleDeleteLoan(loanID);
    if (ok) {
      setUserLoans((prev) =>
        prev.filter((l) => Number(l.id) !== Number(loanID))
      );
    }
  };

  if (userLoans.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-600 shadow-sm">
        <p>Keine Ausleihen gefunden.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-lg font-semibold tracking-tight text-gray-900">
        Meine Ausleihen
      </p>
      <p className="text-sm text-gray-600">
        Wenn du eine Ausleihe ändern oder löschen möchtest, klicke auf das
        Papierkorb-Symbol.
      </p>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="table-auto min-w-full text-sm text-gray-700">
            <thead className="sticky top-0 z-10 bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Leihcode
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Start
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Ende
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Abgeholt
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Zurückgegeben
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Erstellt
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Gegenstände
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {userLoans.map((loan) => (
                <tr
                  key={loan.id}
                  className="odd:bg-white even:bg-gray-50 hover:bg-gray-100/60 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap font-mono tabular-nums text-gray-900">
                    {loan.loan_code}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono tabular-nums text-gray-900">
                    {formatDate(loan.start_date)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono tabular-nums text-gray-900">
                    {formatDate(loan.end_date)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono tabular-nums text-gray-900">
                    {formatDate(loan.take_date)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono tabular-nums text-gray-900">
                    {formatDate(loan.returned_date)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono tabular-nums text-gray-900">
                    {formatDate(loan.created_at)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-gray-900 whitespace-nowrap max-w-none">
                      {Array.isArray(loan.loaned_items_name)
                        ? loan.loaned_items_name.join(", ")
                        : "-"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onDelete(loan.id)}
                      aria-label="Ausleihe löschen"
                      className="inline-flex items-center rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Scroll hint */}
        <div className="border-t border-gray-100 px-4 py-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <ArrowLeftRight className="h-4 w-4 text-gray-400" />
            <span>Hinweis: Horizontal scrollen, um alle Spalten zu sehen.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form4;
