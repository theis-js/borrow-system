import Cookies from "js-cookie";
import { API_BASE } from "@/config/api.config";

export const getBorrowableItems = async (
  startDate: string,
  endDate: string
) => {
  try {
    const response = await fetch(`${API_BASE}/api/loans/borrowable-items`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Cookies.get("token") || ""}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ startDate, endDate }),
    });

    if (!response.ok) {
      return {
        data: null,
        status: "error",
        title: "Server error",
        description:
          "Ein Fehler ist auf dem Server aufgetreten. Manchmal hilft es, die Seite neu zu laden.",
      };
    }

    const data = await response.json();
    return {
      data: data,
      status: "success",
      title: null,
      description: null,
    };
  } catch (error) {
    return {
      data: null,
      status: "error",
      title: "Netzwerkfehler",
      description:
        "Es konnte keine Verbindung zum Server hergestellt werden. Bitte überprüfe deine Internetverbindung.",
    };
  }
};

export const createLoan = async (
  itemIds: number[],
  startDate: string,
  endDate: string,
  note: string | null
) => {
  const response = await fetch(`${API_BASE}/api/loans/createLoan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token") || ""}`,
    },
    body: JSON.stringify({ items: itemIds, startDate, endDate, note }),
  });

  if (!response.ok) {
    return {
      data: null,
      status: "error",
      title: "Server error",
      description:
        "Ein Fehler ist auf dem Server aufgetreten. Manchmal hilft es, die Seite neu zu laden.",
    };
  }

  const data = await response.json();
  return {
    data: data,
    status: "success",
    title: null,
    description: null,
  };
};
