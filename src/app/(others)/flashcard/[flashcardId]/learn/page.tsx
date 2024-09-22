"use client";

import { AuthWrapper } from "@/components/AuthWrapper";
import { FlashcardLearning } from "@/modules/flashcard/learn";

export default function FlashcardLearningPage() {
  return (
    <AuthWrapper>
      <FlashcardLearning />
    </AuthWrapper>
  );
}
