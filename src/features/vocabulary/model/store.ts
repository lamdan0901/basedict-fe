import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

type TVocabStore = {
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
};

type TLearnedVocabState = {
  learnedVocabMap: Record<string, boolean>;
  toggleLearnedVocab: (item: TLexeme, hasLearned: boolean) => void;
};

export const useVocabStore = create<TVocabStore>()(
  immer((set) => ({
    sheetOpen: false as boolean,
    setSheetOpen: (open) => set({ sheetOpen: open }),
  }))
);

export const useLearnedVocabStore = create<TLearnedVocabState>()(
  persist(
    immer((set) => ({
      learnedVocabMap: {} as Record<string, boolean>,
      toggleLearnedVocab: (item, isLearned) => {
        set((state) => {
          if (isLearned) {
            state.learnedVocabMap[item.id] = true;
          } else {
            delete state.learnedVocabMap[item.id];
          }
        });
      },
    })),
    {
      name: "learnedVocab",
    }
  )
);
