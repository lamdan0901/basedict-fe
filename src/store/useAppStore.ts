import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface AppState {
  profile: TUser | null;
  seasonRank: TJlptLevel;
  setProfile: (profile: TUser) => void;
  clearProfile: () => void;
  setSeasonRank: (rank: TJlptLevel) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    immer((set) => ({
      profile: null,
      seasonRank: "N3",
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
