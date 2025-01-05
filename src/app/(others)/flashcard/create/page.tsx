"use client";

import { AuthWrapper } from "@/widgets/auth";
import { FlashcardCreation } from "@/features/flashcard/create";

export default function FlashcardCreationPage() {
  return (
    <AuthWrapper>
      <FlashcardCreation />
    </AuthWrapper>
  );
}
