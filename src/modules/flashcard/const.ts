import { v4 as uuid } from "uuid";

export const flashcardSortMap = {
  popular: "Độ phổ biến",
  updatedAt: "Mới nhất",
};

export const FLASHCARD_SETS_LIMIT = 5;
export const FLASHCARD_LIMIT = 50;

export const defaultFlashcardItem = (uid: string) => ({
  frontSide: "",
  backSide: "",
  uid,
});
export const defaultFlashcardSet = {
  title: "",
  description: "",
  flashCards: [defaultFlashcardItem(uuid())],
};

export enum DefaultFace {
  Front = "Mặt trước",
  Back = "Mặt sau",
}
