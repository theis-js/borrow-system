import { atom } from "jotai";

// Atoms to store the start and end dates for loans
export const startDate = atom<string | null>(null);
export const endDate = atom<string | null>(null);
export const getBorrowableItemsAtom = atom<string[] | boolean>(false);
