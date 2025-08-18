import React from "react";
import { myToast } from "../utils/toastify";

const Form3: React.FC = () => {
  if (localStorage.getItem("borrowCode")) {
    myToast("Ausleihe erfolgreich!", "success");
  } else {
    myToast("Ausleihe fehlgeschlagen!", "error");
  }

  const code = localStorage.getItem("borrowCode") ?? "—";

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-blue-700">3. Ausleihe bestätigt</h2>
      <div className="mt-2 p-6 bg-blue-50/80 border border-blue-200 rounded-2xl text-center shadow-lg">
        <p className="text-blue-800 font-semibold">Ihr Ausleihcode lautet</p>
        <div className="text-3xl font-extrabold tracking-widest text-blue-700 mt-1">
          {code}
        </div>
        <p className="text-blue-600 mt-2 text-sm">
          Bitte merken Sie sich diesen Code, um das Schließfach zu öffnen.
        </p>
      </div>
    </div>
  );
};

export default Form3;
