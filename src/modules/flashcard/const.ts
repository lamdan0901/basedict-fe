import { v4 as uuid } from "uuid";

export const flashcardSortMap = {
  popular: "Độ phổ biến",
  updatedAt: "Mới nhất",
};
export const matchingOptions = ["6", "8", "10", "12"];

export const FLASHCARD_SETS_LIMIT = 5;
export const FLASHCARD_LIMIT = 50;
export const MAX_TAGS = 3;
export const MIN_CARDS_TO_MATCH = 6;
export const MAX_TAG_CHARS = 15;
export const FLASHCARD_SETS_LIMIT_MSG = `Bạn chỉ có thể tạo và theo học tối đa ${FLASHCARD_SETS_LIMIT} bộ`;
export const FLASHCARD_LIMIT_MSG = `Bạn chỉ có thể thêm tối đa ${FLASHCARD_LIMIT} thẻ flashcard vào bộ này`;

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
