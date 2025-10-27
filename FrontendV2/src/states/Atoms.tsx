import { atom } from "jotai";

interface Meta {
  "backend-info": {
    version: String;
  };
  "frontend-info": {
    version: String;
  };
}

export const testAtom = atom<number>(0);
export const setIsLoggedInAtom = atom<boolean>(false);
export const triggerLogoutAtom = atom<boolean>(false);
export const borrowAbleItemsAtom = atom<any[]>([]);
export const infoAtom = atom<Meta | undefined>(undefined);
