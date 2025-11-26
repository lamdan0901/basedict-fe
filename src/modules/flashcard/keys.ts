export const FLASHCARD_KEYS = {
  myFlashcards: (userId?: string) =>
    userId ? ["my-flash-card", userId] : null,
};
