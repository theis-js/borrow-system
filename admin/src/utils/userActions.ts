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
  role: string,
  password: string
) => {
  try {
    const response = await fetch(
      `http://localhost:8002/api/editUser/${userId}`,
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
        const response = await fetch(
            `http://localhost:8002/api/createUser`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get("token")}`,
                },
                body: JSON.stringify({ username, role, password }),
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
