"use client";

import { AuthWrapper } from "@/widgets/auth";
import { FlashcardCreation } from "@/features/flashcard/create";

export default function FlashcardUpdatePage() {
  return (
    <AuthWrapper>
      <FlashcardCreation />
    </AuthWrapper>
  );
}
