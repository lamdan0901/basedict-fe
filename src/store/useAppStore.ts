import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface AppState {
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
      setProfile: (profile: TUser) => {
        set((state) => {
          state.profile = profile;
        });
      },
      clearProfile: () =>
        set((state) => {
          state.profile = null;
        }),
      setSeasonRank: (rank: TJlptLevel) => {
        set((state) => {
          state.seasonRank = rank;
        });
      },
    })),
    {
      name: "app",
    }
  )
);
