import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface AppState {
  profile: TUser | null;
  setProfile: (profile: TUser) => void;
  clearProfile: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    immer((set) => ({
      profile: null,
      setProfile: (profile: TUser) => {
        set((state) => {
          state.profile = profile;
        });
      },
      clearProfile: () =>
        set((state) => {
          state.profile = null;
        }),
    })),
    {
      name: "app",
    }
  )
);
