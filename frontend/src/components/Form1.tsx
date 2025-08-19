import React from "react";
import Cookies from "js-cookie";
import { getBorrowableItems } from "../utils/fetchData";

const Form1: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-slate-900">
        1. Zeitraum wählen
      </h2>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget as HTMLFormElement;
          const fd = new FormData(form);
          const start = (fd.get("startDate") as string) || "";
          const end = (fd.get("endDate") as string) || "";
          Cookies.set("startDate", start);
          Cookies.set("endDate", end);
          getBorrowableItems();
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Start
            </label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
            />
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Ende
            </label>
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Verfügbare Gegenstände anzeigen
        </button>
      </form>
    </div>
  );
};

export default Form1;
