import Cookies from "js-cookie";
import { API_BASE } from "@/config/api.config";

export const handleDelete = async (userId: number) => {
  try {
    const response = await fetch(
      `${API_BASE}/api/admin/user-data/delete-user/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete user");
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false };
  }
};

export const handleEdit = async (
  userId: number,
  first_name: string,
  last_name: string,
  email: string,
  is_admin: boolean,
  role: number
) => {
  try {
    const response = await fetch(
      `${API_BASE}/api/admin/user-data/edit-user/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({
          first_name,
          last_name,
          role,
          email,
          is_admin,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to edit user");
    }
    return { success: true };
  } catch (error) {
    console.error("Error editing user:", error);
    return { success: false };
  }
};

export const createUser = async (
  username: string,
  role: number,
  password: string,
  first_name: string,
  last_name: string,
  email: string,
  isAdmin: boolean
) => {
  try {
    const response = await fetch(
      `${API_BASE}/api/admin/user-data/create-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({
          username,
          role,
          password,
          isAdmin,
          email,
          first_name,
          last_name,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to create user");
    }
    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false };
  }
};

export const changePW = async (newPassword: string, username: string) => {
  try {
    const response = await fetch(
      `${API_BASE}/api/admin/user-data/change-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({ username, password: newPassword }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to change password");
    }
    return { success: true };
  } catch (error) {
    console.error("Error changing password:", error);
    return { success: false };
  }
};

export const deleteLoan = async (loanId: number) => {
  try {
    const response = await fetch(
      `${API_BASE}/api/admin/loan-data/delete-loan/${loanId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete loan");
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting loan:", error);
    return { success: false };
  }
};

export const deleteItem = async (itemId: number) => {
  try {
    const response = await fetch(
      `${API_BASE}/api/admin/item-data/delete-item/${itemId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete item");
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting item:", error);
    return { success: false };
  }
};

export const createItem = async (
  item_name: string,
  can_borrow_role: number,
  lockerNumber: string | null
) => {
  try {
    const response = await fetch(
      `${API_BASE}/api/admin/item-data/create-item`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({ item_name, can_borrow_role, lockerNumber }),
      }
    );
    if (!response.ok) {
      return {
        success: false,
        message:
          "Fehler beim Erstellen des Gegenstands. Der Name des Gegenstandes und die Schließfachnummer dürfen nicht mehrmals vergeben werden.",
      };
    }
    return { success: true };
  } catch (error) {
    console.error("Error creating item:", error);
    return { success: false };
  }
};

export const handleEditItems = async (
  itemId: number,
  item_name: string,
  safe_nr: string | null,
  door_key: string | null,
  can_borrow_role: string
) => {
  try {
    const response = await fetch(
      `${API_BASE}/api/admin/item-data/edit-item/${itemId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({ item_name, safe_nr, door_key, can_borrow_role }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to edit item");
    }
    return { success: true };
  } catch (error) {
    console.error("Error editing item:", error);
    return { success: false };
  }
};

export const changeSafeState = async (itemId: number) => {
  try {
    const response = await fetch(
      `${API_BASE}/api/admin/item-data/change-safe-state/${itemId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to change safe state");
    }
    return { success: true };
  } catch (error) {
    console.error("Error changing safe state:", error);
    return { success: false };
  }
};

export const createAPIentry = async (apiKey: string, name: string) => {
  try {
    const response = await fetch(
      `${API_BASE}/api/admin/api-data/create-api-key`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({ apiKey, entryName: name }),
      }
    );
    if (!response.ok) {
      return {
        success: false,
        message:
          "Fehler beim Erstellen des API Keys. Achten Sie darauf, dass alle Felder ausgefüllt sind und der API Key nicht doppelt vergeben wird.",
      };
    }
    return { success: true };
  } catch (error) {
    console.error("Error creating API entry:", error);
    return { success: false };
  }
};

export const deleteAPKey = async (apiKeyId: number) => {
  try {
    const response = await fetch(
      `${API_BASE}/api/admin/api-data/delete-api-key/${apiKeyId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete API key");
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting API key:", error);
    return { success: false };
  }
};
