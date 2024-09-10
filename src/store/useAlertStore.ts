import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type TAlertStore = {
  loginAlertOpen: boolean;
  setLoginAlertOpen: (open: boolean) => void;
};

export const useAlertStore = create<TAlertStore>()(
  immer((set) => ({
    loginAlertOpen: false,
    setLoginAlertOpen: (open) =>
      set((state) => {
        state.loginAlertOpen = open;
      }),
  }))
);
