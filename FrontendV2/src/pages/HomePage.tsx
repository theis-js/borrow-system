import { useUserContext } from "@/states/Context";

export interface User {
  username: string;
  role: number;
}

export const HomePage = () => {
  const userData = useUserContext();

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome, {userData.username}!</p>
      <p>Your role is: {userData.role}</p>
    </div>
  );
};
