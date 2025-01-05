import { createWithEqualityFn as create } from "zustand/traditional";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface IJpToVnMeaningMeaningState {
  canShowMeaningTips: boolean;
  canShowFlashcardTips: boolean;
  hideMeaningTips: () => void;
  hideFlashcardTips: () => void;
}

export const useJpToVnMeaningStore = create<IJpToVnMeaningMeaningState>()(
  persist(
    immer((set) => ({
      canShowMeaningTips: true as boolean,
      canShowFlashcardTips: true as boolean,
      hideMeaningTips() {
        set((state) => {
          state.canShowMeaningTips = false;
        });
      },
      hideFlashcardTips() {
        set((state) => {
          state.canShowFlashcardTips = false;
        });
      },
    })),
    {
      name: "JpToVnMeaning",
    }
  )
);
