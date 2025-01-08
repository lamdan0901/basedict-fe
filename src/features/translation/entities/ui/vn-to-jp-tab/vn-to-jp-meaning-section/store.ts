import { createWithEqualityFn as create } from "zustand/traditional";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface IVnToJpMeaningMeaningState {
  canShowMeaningTips: boolean;
  hideMeaningTips: () => void;
}

export const useVnToJpMeaningStore = create<IVnToJpMeaningMeaningState>()(
  persist(
    immer((set) => ({
      canShowMeaningTips: true as boolean,
      hideMeaningTips() {
        set((state) => {
          state.canShowMeaningTips = false;
        });
      },
    })),
    {
      name: "VnToJpMeaning",
    }
  )
);
