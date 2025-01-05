"use client";

import { AuthWrapper } from "@/widgets/auth";
import { FlashcardLearning } from "@/features/flashcard/learn";

export default function FlashcardLearningPage() {
  return (
    <AuthWrapper>
      <FlashcardLearning />
    </AuthWrapper>
  );
}
