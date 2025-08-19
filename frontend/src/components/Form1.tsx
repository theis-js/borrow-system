import React from "react";
import Cookies from "js-cookie";
import { getBorrowableItems } from "../utils/fetchData";

const Form1: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-blue-700">1. Zeitraum wählen</h2>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget as HTMLFormElement;
          const fd = new FormData(form);
          const start = (fd.get("startDate") as string) || "";
          const end = (fd.get("endDate") as string) || "";
          Cookies.set("startDate", start);
          Cookies.set("endDate", end);
          getBorrowableItems();
          console.log("Zeitraum erfolgreich gesetzt!");
        }}
      >
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-blue-800 mb-1"
          >
            Start
          </label>
          <input
            type="datetime-local"
            id="startDate"
            name="startDate"
            className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/70"
          />
        </div>
        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-blue-800 mb-1"
          >
            Ende
          </label>
          <input
            type="datetime-local"
            id="endDate"
            name="endDate"
            className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/70"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-xl shadow transition"
        >
          Verfügbare Gegenstände anzeigen
        </button>
      </form>
    </div>
  );
};

export default Form1;
