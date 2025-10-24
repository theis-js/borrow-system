import { setIsLoggedInAtom } from "@/states/Atoms";
import { useAtom } from "jotai";

export const HomePage = () => {
  const [isLoggedIn] = useAtom(setIsLoggedInAtom);
  console.log(isLoggedIn);

  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
};
