import Cookies from "js-cookie";
const API_BASE =
  (import.meta as any).env?.VITE_BACKEND_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:8002";

export const getBorrowableItems = async (
  startDate: string,
  endDate: string
) => {
  try {
    const response = await fetch(`${API_BASE}/api/borrowableItems`, {
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
    console.log(data);
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
