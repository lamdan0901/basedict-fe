import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type TAnswerStore = {
  userAnswers: Record<number, string>;
  setUserAnswers: (questionIndex: number, answer: string) => void;
  clearUserAnswers: () => void;
};

export const useAnswerStore = create<TAnswerStore>()(
  immer((set) => ({
    userAnswers: {},
    setUserAnswers: (questionIndex, answer) =>
      set((state) => {
        state.userAnswers[questionIndex] = answer;
      }),
    clearUserAnswers: () => {
      set((state) => {
        state.userAnswers = {};
      });
    },
  }))
);
