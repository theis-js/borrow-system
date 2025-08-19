import Cookies from "js-cookie";
import { myToast } from "./toastify";

// Event name used to notify the app when the list of items has been updated
export const ALL_ITEMS_UPDATED_EVENT = "allItemsUpdated";

export const fetchAllData = async (token: string | undefined) => {
  if (!token) return;
  try {
    // First we fetch all items that are potentially available for borrowing
    const response = await fetch("http://localhost:8002/api/items", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      myToast("Failed to fetch items", "error");
      return;
    }

    const data = await response.json();
    localStorage.setItem("allItems", JSON.stringify(data));
    // Notify listeners (e.g., Sidebar) that items have been updated
    window.dispatchEvent(new Event(ALL_ITEMS_UPDATED_EVENT));
  } catch (error) {
    myToast("An error occurred", "error");
  }
};

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await fetch("http://localhost:8002/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      return { success: false } as const;
    }

    const data = await response.json();
    if (data?.token) {
      Cookies.set("token", data.token);
      myToast("Login successful!", "success");
      fetchAllData(Cookies.get("token"));
      return { success: true, token: data.token } as const;
    }

    return { success: false } as const;
  } catch (e) {
    return { success: false } as const;
  }
};
