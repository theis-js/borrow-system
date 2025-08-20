import Cookies from "js-cookie";
import { myToast } from "./toastify";

// Event name used to notify the app when the list of items has been updated
export const ALL_ITEMS_UPDATED_EVENT = "allItemsUpdated";
export const BORROWABLE_ITEMS_UPDATED_EVENT = "borrowableItemsUpdated";
export const AUTH_LOGOUT_EVENT = "authLogout";

let sendError = false;

function logout() {
  Cookies.remove("token");
  Cookies.remove("startDate");
  Cookies.remove("endDate");
  localStorage.removeItem("allItems");
  localStorage.removeItem("allLoans");
  localStorage.removeItem("userLoans");
  localStorage.removeItem("borrowableItems");
  window.dispatchEvent(new Event(ALL_ITEMS_UPDATED_EVENT));
  window.dispatchEvent(new Event(BORROWABLE_ITEMS_UPDATED_EVENT));
  window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
}

export const fetchAllData = async (token: string | undefined) => {
  if (!token) return;
  // First we fetch all items that are potentially available for borrowing
  try {
    const response = await fetch("https://backend.insta.the1s.de/api/items", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 500) {
      if (!sendError) {
        sendError = true;
        myToast("Session expired. Please log in again.", "error");
        logout();
        return;
      }
      return;
    }

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

  // get all loans
  try {
    const response = await fetch("https://backend.insta.the1s.de/api/loans", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 500) {
      if (!sendError) {
        sendError = true;
        myToast("Session expired. Please log in again.", "error");
        logout();
        return;
      }
      return;
    }

    if (!response.ok) {
      myToast("Failed to fetch loans!", "error");
      return;
    }

    const data = await response.json();
    localStorage.setItem("allLoans", JSON.stringify(data));
    // Notify listeners (e.g., Sidebar) that loans have been updated
    window.dispatchEvent(new Event(ALL_ITEMS_UPDATED_EVENT));
  } catch (error) {
    myToast("An error occurred", "error");
  }

  // get user loans
  try {
    const response = await fetch("https://backend.insta.the1s.de/api/userLoans", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 500) {
      if (!sendError) {
        sendError = true;
        myToast("Session expired. Please log in again.", "error");
        logout();
        return;
      }
      return;
    }

    if (!response.ok) {
      myToast("Failed to fetch user loans!", "error");
      return;
    }

    const data = await response.json();
    localStorage.setItem("userLoans", JSON.stringify(data));
    // Notify listeners (e.g., Sidebar) that loans have been updated
    window.dispatchEvent(new Event(ALL_ITEMS_UPDATED_EVENT));
  } catch (error) {
    myToast("An error occurred", "error");
  }
};

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await fetch("https://backend.insta.the1s.de/api/login", {
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

export const getBorrowableItems = async () => {
  const startDate = Cookies.get("startDate");
  const endDate = Cookies.get("endDate");

  if (!startDate || !endDate) {
    myToast("Bitte wähle einen Zeitraum aus.", "error");
    return;
  }

  try {
    const response = await fetch("https://backend.insta.the1s.de/api/borrowableItems", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Cookies.get("token") || ""}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ startDate, endDate }),
    });

    if (response.status === 500) {
      if (!sendError) {
        sendError = true;
        myToast("Session expired. Please log in again.", "error");
        logout();
        return;
      }
      return;
    }

    if (!response.ok) {
      myToast("Failed to fetch borrowable items", "error");
      return;
    }

    const data = await response.json();
    localStorage.setItem("borrowableItems", JSON.stringify(data));
    window.dispatchEvent(new Event(BORROWABLE_ITEMS_UPDATED_EVENT)); // notify same-tab listeners
    console.log("Borrowable items fetched successfully");
  } catch (error) {
    myToast("An error occurred", "error");
  }
};
