import Cookies from "js-cookie";

const API_BASE =
  (import.meta as any).env?.VITE_BACKEND_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:8002";

export const fetchUserData = async () => {
  const response = await fetch(`${API_BASE}/api/allUsers`, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });
  const data = await response.json();
  return data;
};
