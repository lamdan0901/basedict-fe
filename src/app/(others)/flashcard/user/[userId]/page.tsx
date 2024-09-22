"use client";

import { AuthWrapper } from "@/components/AuthWrapper";
import { UserFlashcard } from "@/modules/flashcard/user-flashcard";

export default function UserFlashcardPage() {
  return (
    <AuthWrapper>
      <UserFlashcard />
    </AuthWrapper>
  );
}
