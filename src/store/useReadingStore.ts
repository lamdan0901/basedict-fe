import { create } from "zustand";

type TReadingStore = {
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  jlptModalOpen: boolean;
  setJLPTModalOpen: (open: boolean) => void;
};

export const useReadingStore = create<TReadingStore>((set) => ({
  sheetOpen: false,
  setSheetOpen: (open: boolean) => set({ sheetOpen: open }),
  jlptModalOpen: false,
  setJLPTModalOpen: (open: boolean) => set({ jlptModalOpen: open }),
}));
