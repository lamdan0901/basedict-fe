"use client";

import { AuthWrapper } from "@/components/AuthWrapper";
import { MyFlashcard } from "@/modules/flashcard/my-flashcard";

export default function MyFlashcardPage() {
  return (
    <AuthWrapper>
      <MyFlashcard />
    </AuthWrapper>
  );
}
