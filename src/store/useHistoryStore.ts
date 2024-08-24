import { MAX_HISTORY_ITEMS } from "@/constants";
import { THistoryItem } from "@/interface/history";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface IHistoryState {
  historyItems: THistoryItem[];
  addHistoryItem: (item: THistoryItem) => void;
  // removeHistoryItem: (uid: string) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<IHistoryState>()(
  persist(
    immer((set) => ({
      historyItems: [],
      addHistoryItem: (item) => {
        set((state) => {
          if (state.historyItems.length >= MAX_HISTORY_ITEMS) {
            state.historyItems.pop();
          }
          state.historyItems.unshift(item);
        });
      },
      // removeHistoryItem: (uid) => {
      //   set((state) => {
      //     state.historyItems = state.historyItems.filter(
      //       (item) => item.uid !== uid
      //     );
      //   });
      // },
      clearHistory: () => set({ historyItems: [] }),
    })),
    {
      name: "history",
    }
  )
);
