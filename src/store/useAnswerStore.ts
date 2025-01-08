import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { combine } from "zustand/middleware";

export const useAnswerStore = create(
  immer(
    combine(
      {
        userAnswers: {} as Record<number, string>,
      },
      (set) => ({
        setUserAnswers: (questionIndex: number, answer: string) =>
          set((state) => ({
            userAnswers: { ...state.userAnswers, [questionIndex]: answer },
          })),
        clearUserAnswers: () => set({ userAnswers: {} }),
      })
    )
  )
);
