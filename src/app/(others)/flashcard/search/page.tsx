"use client";

import { AuthWrapper } from "@/components/AuthWrapper";
import { FlashcardSearch } from "@/modules/flashcard/search";

export default function FlashcardSearchPage() {
  return (
    <AuthWrapper>
      <FlashcardSearch />
    </AuthWrapper>
  );
}
