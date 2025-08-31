import Cookies from "js-cookie";

export const fetchUserData = async () => {
  const response = await fetch("http://localhost:8002/api/allUsers", {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });
  const data = await response.json();
  return data;
};
