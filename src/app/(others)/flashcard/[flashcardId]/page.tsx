"use client";

import { AuthWrapper } from "@/components/AuthWrapper";
import { FlashcardDetail } from "@/modules/flashcard/detail";

export default function FlashcardViewPage() {
  return (
    <AuthWrapper>
      <FlashcardDetail />
    </AuthWrapper>
  );
}
