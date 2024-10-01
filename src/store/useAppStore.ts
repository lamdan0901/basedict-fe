import { createWithEqualityFn as create } from "zustand/traditional";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface AppState {
  isLoading: boolean;
  profile: TUser | null;
  seasonRank: TJlptLevel;
  canShowMeaningTips: boolean;
  canShowFlashcardTips: boolean;
  hideMeaningTips: () => void;
  hideFlashcardTips: () => void;
  setProfile: (profile: TUser) => void;
  clearProfile: () => void;
  setSeasonRank: (rank: TJlptLevel) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    immer((set) => ({
      isLoading: true as boolean,
      profile: null as TUser | null,
      seasonRank: "N3" as TJlptLevel,
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
      setProfile: (profile) => {
        set((state) => {
          state.profile = profile;
        });
      },
      clearProfile: () =>
        set((state) => {
          state.profile = null;
        }),
      setSeasonRank: (rank) => {
        set((state) => {
          state.seasonRank = rank;
        });
      },
    })),
    {
      name: "app",
      onRehydrateStorage: () => (state) => {
        if (state) state.isLoading = false;
      },
    }
  )
);
