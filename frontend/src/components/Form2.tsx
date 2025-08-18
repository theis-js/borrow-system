import React from "react";

const Form2: React.FC = () => {
  const items = JSON.parse(localStorage.getItem("borrowableItems") || "[]");
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-blue-700">
        2. Gegenstand auswählen
      </h2>
      <form className="space-y-4">
        {items.length === 0 ? (
          <div className="text-red-600 font-medium text-center bg-red-50 border border-red-200 rounded-xl p-4">
            Keine Gegenstände verfügbar für diesen Zeitraum.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item: any) => (
              <label
                key={item.id}
                htmlFor={String(item.id)}
                className="group cursor-pointer bg-white/80 rounded-xl p-4 shadow hover:shadow-md transition border border-blue-100 flex items-start gap-3"
              >
                <input
                  type="checkbox"
                  name={String(item.id)}
                  id={String(item.id)}
                  className="mt-1 h-4 w-4 rounded border-blue-300 text-blue-600 focus:ring-blue-400"
                />
                <div>
                  <h3 className="text-sm font-semibold text-blue-800">
                    {item.title}
                  </h3>
                  <p className="text-xs text-blue-500/80 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            className="flex-1 sm:flex-none sm:w-36 bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 font-medium py-2 px-4 rounded-xl shadow-sm transition"
          >
            Zurück
          </button>
          <button
            type="submit"
            className="flex-1 sm:flex-none sm:w-40 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-xl shadow transition"
          >
            Ausleihen
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form2;
