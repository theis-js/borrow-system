import { myToast } from "./toastify";
import Cookies from "js-cookie";

export const handleDeleteLoan = async (loanID: number): Promise<boolean> => {
  try {
    const response = await fetch(
      `http://localhost:8002/api/deleteLoan/${loanID}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Cookies.get("token") || ""}`,
        },
      }
    );

    if (!response.ok) {
      myToast("Fehler beim Löschen der Ausleihe", "error");
      return false;
    }

    const raw = localStorage.getItem("userLoans");
    let current: Array<{ id: number }> = [];

    try {
      const parsed = raw ? JSON.parse(raw) : [];
      current = Array.isArray(parsed) ? parsed : [];
    } catch {
      current = [];
    }

    const updated = current.filter(
      (loan) => Number(loan.id) !== Number(loanID)
    );
    localStorage.setItem("userLoans", JSON.stringify(updated));

    myToast("Ausleihe erfolgreich gelöscht!", "success");
    return true;
  } catch (error) {
    console.error("Error deleting loan:", error);
    myToast("Fehler beim löschen der Ausleihe", "error");
    return false;
  }
};

// Parse existing cookie and coerce to numbers
let removeArr: number[] = (() => {
  try {
    const raw = Cookies.get("removeArr");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.map((v) => Number(v)).filter((n) => Number.isFinite(n))
      : [];
  } catch {
    return [];
  }
})();

const rawCookies = Cookies.withConverter({
  write: (value: string) => value, // store raw JSON
});

export const addToRemove = (itemID: number) => {
  if (!Number.isFinite(itemID)) return;
  if (!removeArr.includes(itemID)) {
    removeArr.push(itemID);
    rawCookies.set("removeArr", JSON.stringify(removeArr));
  }
};

export const rmFromRemove = (itemID: number) => {
  removeArr = removeArr.filter((item) => item !== itemID);
  rawCookies.set("removeArr", JSON.stringify(removeArr));
};

export const createLoan = async (startDate: string, endDate: string) => {
  const items = removeArr;
  const response = await fetch("http://localhost:8002/api/createLoan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token") || ""}`,
    },
    body: JSON.stringify({ items, startDate, endDate }),
  });

  if (!response.ok) {
    myToast("Fehler beim Erstellen der Ausleihe", "error");
    return false;
  }

  // Clear selection on success
  removeArr = [];
  Cookies.set("removeArr", "[]");
  myToast("Ausleihe erfolgreich erstellt!", "success");
  return true;
};
