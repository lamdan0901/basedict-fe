import { create } from "zustand";
import { combine } from "zustand/middleware";

export const useReadingStore = create(
  combine(
    {
      sheetOpen: false,
      jlptModalOpen: false,
    },
    (set) => ({
      setSheetOpen: (open: boolean) => set({ sheetOpen: open }),
      setJLPTModalOpen: (open: boolean) => set({ jlptModalOpen: open }),
    })
  )
);
