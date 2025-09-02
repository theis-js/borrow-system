import Cookies from "js-cookie";

export const fetchUserData = async () => {
  const response = await fetch("https://backend.insta.the1s.de/api/allUsers", {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });
  const data = await response.json();
  return data;
};
