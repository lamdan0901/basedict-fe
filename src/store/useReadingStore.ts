import { create } from "zustand";

type TReadingStore = {
  selectedReadingItemId: number | null;
  setReadingItemId: (id: number | null) => void;
  hasReadBaseDict: boolean;
  setHasReadBaseDict: (hasReadBaseDict: boolean) => void;
  hasReadJLPTTest: boolean;
  setHasReadJLPTTest: (hasReadJLPTTest: boolean) => void;
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  jlptModalOpen: boolean;
  setJLPTModalOpen: (open: boolean) => void;
};

export const useReadingStore = create<TReadingStore>((set) => ({
  selectedReadingItemId: null,
  setReadingItemId: (id) => set({ selectedReadingItemId: id }),
  hasReadBaseDict: false,
  setHasReadBaseDict: (hasReadBaseDict: boolean) => set({ hasReadBaseDict }),
  hasReadJLPTTest: false,
  setHasReadJLPTTest: (hasReadJLPTTest: boolean) => set({ hasReadJLPTTest }),
  sheetOpen: false,
  setSheetOpen: (open: boolean) => set({ sheetOpen: open }),
  jlptModalOpen: false,
  setJLPTModalOpen: (open: boolean) => set({ jlptModalOpen: open }),
}));
