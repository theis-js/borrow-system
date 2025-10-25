import { createContext } from "react";
import { useContext } from "react";

export interface User {
  username: string;
  role: number;
}

export const UserContext = createContext<User | undefined>(undefined);

export function useUserContext() {
  const user = useContext(UserContext);

  if (user === undefined) {
    throw new Error("useUserContext must be used with a UserContext")
  }

  return user;
}