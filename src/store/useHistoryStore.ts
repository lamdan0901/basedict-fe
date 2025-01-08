import { MAX_HISTORY_ITEMS } from "@/shared/constants";
import { THistoryItem } from "@/interface/history";
import { create } from "zustand";
import { persist, combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const useHistoryStore = create(
  persist(
    immer(
      combine(
        {
          historyItems: [] as THistoryItem[],
        },
        (set) => ({
          addHistoryItem: (item: THistoryItem) =>
            set((state) => {
              if (state.historyItems.length >= MAX_HISTORY_ITEMS) {
                state.historyItems.pop();
              }
              state.historyItems.unshift(item);
            }),
          clearHistory: () => set({ historyItems: [] }),
        })
      )
    ),
    {
      name: "history",
    }
  )
);
