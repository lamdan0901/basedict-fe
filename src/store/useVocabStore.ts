import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type TVocabStore = {
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
};

export const useVocabStore = create<TVocabStore>()(
  immer((set) => ({
    sheetOpen: false as boolean,
    setSheetOpen: (open: boolean) => set({ sheetOpen: open }),
  }))
);
