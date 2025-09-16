import Cookies from "js-cookie";

export const handleDelete = async (userId: number) => {
  try {
    const response = await fetch(
      `http://localhost:8002/api/deleteUser/${userId}`,
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
  username: string,
  role: string
) => {
  try {
    const response = await fetch(
      `http://localhost:8002/api/editUser/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({ username, role }),
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
  password: string
) => {
  try {
    const response = await fetch(`http://localhost:8002/api/createUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify({ username, role, password }),
    });
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
    const response = await fetch(`http://localhost:8002/api/changePWadmin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify({ newPassword, username }),
    });
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
      `http://localhost:8002/api/deleteLoan/${loanId}`,
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
      `http://localhost:8002/api/deleteItem/${itemId}`,
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
  can_borrow_role: number
) => {
  try {
    const response = await fetch(`http://localhost:8002/api/createItem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify({ item_name, can_borrow_role }),
    });
    if (!response.ok) {
      throw new Error("Failed to create item");
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
  can_borrow_role: string
) => {
  try {
    const response = await fetch("http://localhost:8002/api/updateItemByID", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify({ itemId, item_name, can_borrow_role }),
    });
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
      `http://localhost:8002/api/changeSafeState/${itemId}`,
      {
        method: "PUT",
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
