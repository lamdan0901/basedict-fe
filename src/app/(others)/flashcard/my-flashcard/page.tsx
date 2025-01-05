"use client";

import { AuthWrapper } from "@/widgets/auth";
import { MyFlashcard } from "@/features/flashcard/my-flashcard";

export default function MyFlashcardPage() {
  return (
    <AuthWrapper>
      <MyFlashcard />
    </AuthWrapper>
  );
}
