import Cookies from "js-cookie";

export const handleDelete = async (userId: number) => {
  try {
    const response = await fetch(
      `https://backend.insta.the1s.de/api/deleteUser/${userId}`,
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
  role: string,
  password: string
) => {
  try {
    const response = await fetch(
      `https://backend.insta.the1s.de/api/editUser/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({ username, role, password }),
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
    const response = await fetch(`https://backend.insta.the1s.de/api/createUser`, {
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

export const deleteLoan = async (loanId: number) => {
  try {
    const response = await fetch(
      `https://backend.insta.the1s.de/api/deleteLoan/${loanId}`,
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
      `https://backend.insta.the1s.de/api/deleteItem/${itemId}`,
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
    const response = await fetch(`https://backend.insta.the1s.de/api/createItem`, {
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
