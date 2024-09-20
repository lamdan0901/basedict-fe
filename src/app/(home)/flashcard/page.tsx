"use client";

import { AuthWrapper } from "@/components/AuthWrapper";
import { FlashcardExploring } from "@/modules/flashcard/explore";

export default function FlashcardExploringPage() {
  return (
    <AuthWrapper>
      <FlashcardExploring />
    </AuthWrapper>
  );
}
