"use client";

import { AuthWrapper } from "@/components/AuthWrapper";
import { FlashcardCreation } from "@/modules/flashcard/create";

export default function FlashcardCreationPage() {
  return (
    <AuthWrapper>
      <FlashcardCreation />
    </AuthWrapper>
  );
}
