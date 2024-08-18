import { create } from "zustand";

type TReadingStore = {
  selectedReadingItemId: number | null;
  setReadingItemId: (id: number | null) => void;
  hasRead: boolean;
  setHasRead: (hasRead: boolean) => void;
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  jlptModalOpen: boolean;
  setJLPTModalOpen: (open: boolean) => void;
};

export const useReadingStore = create<TReadingStore>((set) => ({
  selectedReadingItemId: null,
  setReadingItemId: (id: number | null) => set({ selectedReadingItemId: id }),
  hasRead: false,
  setHasRead: (hasRead: boolean) => set({ hasRead }),
  sheetOpen: false,
  setSheetOpen: (open: boolean) => set({ sheetOpen: open }),
  jlptModalOpen: false,
  setJLPTModalOpen: (open: boolean) => set({ jlptModalOpen: open }),
}));
