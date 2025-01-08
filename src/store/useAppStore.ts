import { createWithEqualityFn as create } from "zustand/traditional";
import { persist, combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const useAppStore = create(
  persist(
    immer(
      combine(
        {
          isLoading: true as boolean,
          profile: null as TUser | null,
          seasonRank: "N3",
        },
        (set) => ({
          setProfile: (profile: TUser) => set({ profile }),
          clearProfile: () => set({ profile: null }),
          setSeasonRank: (rank: TJlptLevel) => set({ seasonRank: rank }),
        })
      )
    ),
    {
      name: "app",
      onRehydrateStorage: () => (state) => {
        if (state) state.isLoading = false;
      },
    }
  )
);
