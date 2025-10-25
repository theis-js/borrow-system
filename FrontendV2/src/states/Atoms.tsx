import { atom } from "jotai";

export const testAtom = atom<number>(0);
export const setIsLoggedInAtom = atom<boolean>(false);
export const triggerLogoutAtom = atom<boolean>(false);
