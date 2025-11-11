import Cookies from "js-cookie";
import { API_BASE } from "@/config/api.config";

export const fetchUserData = async () => {
  const response = await fetch(`${API_BASE}/api/admin/user-data/users`, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });
  const data = await response.json();
  return data;
};
