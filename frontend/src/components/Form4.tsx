import React from "react";
import { Trash, ArrowLeftRight } from "lucide-react";
import { handleDeleteLoan } from "../utils/userHandler";
import { useMutation, useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { queryClient } from "../utils/queryClient";
import { onTake, onReturn } from "../utils/userHandler";

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
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return iso;
  const [, y, M, d, h, min] = m;
  return `${d}.${M}.${y} ${h}:${min}`;
};

async function fetchUserLoans(): Promise<Loan[]> {
  const res = await fetch("https://backend.insta.the1s.de/api/userLoans", {
    method: "GET",
    headers: { Authorization: `Bearer ${Cookies.get("token") || ""}` },
  });
  if (!res.ok) throw new Error("Failed to fetch user loans");
  const data = await res.json();
  if (data === "No loans found for this user") return [];
  return Array.isArray(data) ? (data as Loan[]) : [];
}

const Form4: React.FC = () => {
  const { data: userLoans = [], isFetching } = useQuery({
    queryKey: ["userLoans"],
    queryFn: fetchUserLoans,
  });

  const deleteMutation = useMutation({
    mutationFn: (loanID: number) => handleDeleteLoan(loanID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userLoans"] });
    },
  });

  const takeMutation = useMutation({
    mutationFn: (loanID: number) => onTake(loanID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userLoans"] });
    },
  });

  const returnMutation = useMutation({
    mutationFn: (loanID: number) => onReturn(loanID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userLoans"] });
    },
  });

  const onDelete = (loanID: number) => deleteMutation.mutate(loanID);

  if (isFetching) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-600 shadow-sm">
        <p>Lade Ausleihen…</p>
      </div>
    );
  }

  if (userLoans.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-600 shadow-sm">
        <p>Keine Ausleihen gefunden.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-lg font-semibold tracking-tight text-slate-900">
        Meine Ausleihen
      </p>
      <p className="text-sm text-slate-600">
        Tippe auf das Papierkorb-Symbol, um eine Ausleihe zu löschen.
      </p>

      {/* Mobile: cards */}
      <div className="space-y-2 sm:hidden">
        {userLoans.map((loan) => (
          <div
            key={loan.id}
            className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900">
                  Leihcode: <span className="font-mono">{loan.loan_code}</span>
                </div>
                <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-700">
                  <div>
                    <span className="text-slate-500">Start:</span>{" "}
                    {formatDate(loan.start_date)}
                  </div>
                  <div>
                    <span className="text-slate-500">Ende:</span>{" "}
                    {formatDate(loan.end_date)}
                  </div>
                  <div>
                    <span className="text-slate-500">Abgeholt:</span>{" "}
                    {loan.take_date ? (
                      formatDate(loan.take_date)
                    ) : (
                      <button
                        className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50"
                        onClick={() => takeMutation.mutate(loan.id)}
                        disabled={takeMutation.isPending}
                      >
                        {takeMutation.isPending ? "..." : "Abholen"}
                      </button>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-500">Zurück:</span>{" "}
                    {loan.returned_date ? (
                      formatDate(loan.returned_date)
                    ) : (
                      <button
                        className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:opacity-50"
                        onClick={() => returnMutation.mutate(loan.id)}
                        disabled={returnMutation.isPending || !loan.take_date}
                        title={!loan.take_date ? "Erst abholen" : ""}
                      >
                        {returnMutation.isPending ? "..." : "Zurückgeben"}
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-700">
                  <span className="text-slate-500">Gegenstände:</span>{" "}
                  {Array.isArray(loan.loaned_items_name)
                    ? loan.loaned_items_name.join(", ")
                    : "-"}
                </div>
              </div>
              <button
                onClick={() => onDelete(loan.id)}
                aria-label="Ausleihe löschen"
                className="flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/30"
              >
                <Trash className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="table-auto min-w-full text-sm text-slate-700">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Leihcode
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Start
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Ende
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Abgeholt
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Zurückgegeben
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Erstellt
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Gegenstände
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userLoans.map((loan) => (
                <tr key={loan.id} className="odd:bg-white even:bg-slate-50">
                  <td className="px-4 py-3 whitespace-nowrap font-mono tabular-nums text-slate-900">
                    {loan.loan_code}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono tabular-nums text-slate-900">
                    {formatDate(loan.start_date)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono tabular-nums text-slate-900">
                    {formatDate(loan.end_date)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono tabular-nums text-slate-900">
                    {loan.take_date ? (
                      formatDate(loan.take_date)
                    ) : (
                      <button
                        className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50"
                        onClick={() => takeMutation.mutate(loan.id)}
                        disabled={takeMutation.isPending}
                      >
                        {takeMutation.isPending ? "..." : "Abholen"}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono tabular-nums text-slate-900">
                    {loan.returned_date ? (
                      formatDate(loan.returned_date)
                    ) : (
                      <button
                        className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:opacity-50"
                        onClick={() => returnMutation.mutate(loan.id)}
                        disabled={returnMutation.isPending || !loan.take_date}
                        title={!loan.take_date ? "Erst abholen" : ""}
                      >
                        {returnMutation.isPending ? "..." : "Zurückgeben"}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono tabular-nums text-slate-900">
                    {formatDate(loan.created_at)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-slate-900">
                      {Array.isArray(loan.loaned_items_name)
                        ? loan.loaned_items_name.join(", ")
                        : ""}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onDelete(loan.id)}
                      aria-label="Ausleihe löschen"
                      className="inline-flex items-center rounded-md p-2 text-slate-600 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/30"
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
