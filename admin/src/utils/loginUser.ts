import Cookies from "js-cookie";

const API_BASE =
  (import.meta as any).env?.VITE_BACKEND_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:8002";

export type LoginSuccess = { success: true };
export type LoginFailure = {
  success: false;
  message: string;
  description: string;
};
export type LoginResult = LoginSuccess | LoginFailure;

export const loginFunc = async (
  username: string,
  password: string
): Promise<LoginResult> => {
  try {
    const response = await fetch(`${API_BASE}/api/loginAdmin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Login failed!",
        description: "Invalid username or password.",
      };
    }

    // Successful login
    const data = await response.json();
    Cookies.set("token", data.token);
    localStorage.setItem("userName", data.first_name);
    return { success: true };
  } catch (error) {
    console.error("Error logging in:", error);
    return {
      success: false,
      message: "Login failed!",
      description: "Server error.",
    };
  }
};
