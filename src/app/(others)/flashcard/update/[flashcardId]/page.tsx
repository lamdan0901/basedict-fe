"use client";

import { AuthWrapper } from "@/components/AuthWrapper";
import { FlashcardCreation } from "@/modules/flashcard/create";

export default function FlashcardUpdatePage() {
  return (
    <AuthWrapper>
      <FlashcardCreation />
    </AuthWrapper>
  );
}
