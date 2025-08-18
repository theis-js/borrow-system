import React, { useState } from "react";

// Beispiel-Daten für die Übersicht in der Seitenleiste
const allItems = [
  { id: 1, name: "Kamera" },
  { id: 2, name: "Mikrofon" },
  { id: 3, name: "Licht-Set" },
  { id: 4, name: "Stativ" },
];

// Beispiel-Ausleihen, später per API dynamisch!
const loans = [
  {
    itemId: 1,
    username: "max",
    start: "2025-01-01T08:00",
    end: "2025-01-01T18:00",
    loanCode: "123456",
  },
  {
    itemId: 3,
    username: "sara",
    start: "2025-01-02T10:00",
    end: "2025-01-02T16:00",
    loanCode: "654321",
  },
];

// Dummy: Für das Beispiel sind einige Items "nicht verfügbar" bei bestimmten Zeiträumen
function getAvailableItems(start: string, end: string) {
  if (start.startsWith("2025-01-01")) {
    return allItems.filter(
      (item) => item.name === "Kamera" || item.name === "Stativ"
    );
  }
  return allItems;
}

export default function App() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [availableItems, setAvailableItems] = useState<typeof allItems>([]);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  // Dummy Code für das Design
  const loanCode = "123456";

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-50 via-white to-blue-100">
      {/* Seitenleiste */}
      <aside className="w-80 min-h-screen bg-white/90 backdrop-blur border-r border-blue-100 shadow-xl flex flex-col p-8">
        <h2 className="text-2xl font-extrabold mb-6 text-blue-700 tracking-tight flex items-center gap-2">
          <svg
            className="w-7 h-7 text-blue-500"
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
        <ul className="space-y-5 flex-1">
          {allItems.map((item) => {
            const itemLoans = loans.filter((loan) => loan.itemId === item.id);
            return (
              <li
                key={item.id}
                className="bg-white/80 rounded-xl p-4 shadow hover:shadow-md transition"
              >
                <div className="font-semibold text-gray-900 flex items-center gap-2">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{
                      background:
                        itemLoans.length === 0 ? "#34d399" : "#60a5fa",
                    }}
                  ></span>
                  {item.name}
                </div>
                {itemLoans.length === 0 ? (
                  <div className="text-green-500 text-xs mt-1 font-medium">
                    Verfügbar
                  </div>
                ) : (
                  <ul className="mt-2 space-y-1">
                    {itemLoans.map((loan, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-blue-800 bg-blue-100/60 p-1 rounded"
                      >
                        <span className="font-bold">{loan.username}</span>
                        <span className="ml-2">
                          {formatDateTime(loan.start)} –{" "}
                          {formatDateTime(loan.end)}
                        </span>
                        <span className="ml-2 text-gray-400">
                          ({loan.loanCode})
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
        <div className="mt-10 text-xs text-gray-400 flex items-center gap-4">
          <span className="inline-block w-3 h-3 bg-green-400 rounded-full mr-1"></span>
          Verfügbar
          <span className="inline-block w-3 h-3 bg-blue-400 rounded-full ml-4 mr-1"></span>
          Verliehen
        </div>
      </aside>

      {/* Hauptbereich */}
      <main className="flex-1 flex flex-col items-center py-14 px-4">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-blue-800 tracking-tight drop-shadow-sm">
            Gegenstand ausleihen
          </h1>
          <p className="text-blue-400 mt-2 text-lg font-medium">
            Schnell und unkompliziert Equipment reservieren
          </p>
        </header>
        <div className="bg-white/90 shadow-2xl rounded-3xl p-10 w-full max-w-xl ring-1 ring-blue-100">
          {step === 1 && (
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                setAvailableItems(getAvailableItems(startDate, endDate));
                setStep(2);
              }}
            >
              <h2 className="text-xl font-bold mb-2 text-blue-700">
                1. Zeitraum wählen
              </h2>
              <div>
                <label className="block font-medium mb-1 text-blue-900">
                  Startdatum
                </label>
                <input
                  type="datetime-local"
                  className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-blue-900">
                  Enddatum
                </label>
                <input
                  type="datetime-local"
                  className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  min={startDate}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-xl shadow transition disabled:bg-gray-300"
                disabled={!startDate || !endDate || endDate <= startDate}
              >
                Verfügbare Gegenstände anzeigen
              </button>
            </form>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-6 text-blue-700">
                2. Gegenstand auswählen
              </h2>
              {availableItems.length === 0 ? (
                <div className="text-red-600 mb-8 font-medium text-center">
                  Keine Gegenstände verfügbar für diesen Zeitraum.
                </div>
              ) : (
                <ul className="mb-8 space-y-3">
                  {availableItems.map((item) => (
                    <li
                      key={item.id}
                      className={`flex justify-between items-center p-4 rounded-xl shadow-sm border ${
                        selectedItem === item.id
                          ? "bg-blue-100 border-blue-400"
                          : "bg-green-50 border-green-100 hover:bg-blue-50"
                      } transition`}
                    >
                      <span className="font-medium text-lg">{item.name}</span>
                      <button
                        className={`px-4 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 text-white text-sm font-semibold shadow hover:from-blue-600 hover:to-blue-500 ${
                          selectedItem === item.id ? "ring-2 ring-blue-400" : ""
                        }`}
                        onClick={() => setSelectedItem(item.id)}
                      >
                        {selectedItem === item.id ? "Ausgewählt" : "Auswählen"}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex justify-between">
                <button
                  className="px-5 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 font-semibold shadow"
                  onClick={() => setStep(1)}
                >
                  Zurück
                </button>
                <button
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-xl hover:from-blue-700 hover:to-blue-500 font-bold shadow transition disabled:bg-gray-300"
                  disabled={selectedItem === null}
                  onClick={() => setStep(3)}
                >
                  Ausleihen
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="mt-2 p-8 bg-blue-50/80 border border-blue-200 rounded-2xl text-center shadow-lg">
              <h3 className="font-extrabold text-blue-700 mb-3 text-2xl">
                Ausleihe bestätigt!
              </h3>
              <p className="mb-2 text-lg">
                Ihr Ausleih-Code lautet:{" "}
                <span className="font-mono text-2xl text-blue-900 bg-white px-2 py-1 rounded shadow">
                  {loanCode}
                </span>
              </p>
              <p className="mt-2 text-blue-600 text-sm">
                Bitte merken Sie sich diesen Code, um das Schließfach zu öffnen.
              </p>
              <button
                className="mt-8 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-xl hover:from-blue-700 hover:to-blue-500 font-bold shadow"
                onClick={() => {
                  setStep(1);
                  setStartDate("");
                  setEndDate("");
                  setSelectedItem(null);
                }}
              >
                Neue Ausleihe
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Hilfsfunktion: Datumsformatierung (z.B. 01.01.2025 08:00)
function formatDateTime(dt: string) {
  const d = new Date(dt);
  return (
    d.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) +
    " " +
    d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })
  );
}
