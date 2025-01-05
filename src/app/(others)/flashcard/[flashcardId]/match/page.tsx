"use client";

import { AuthWrapper } from "@/widgets/auth";
import { FlashcardMatching } from "@/features/flashcard/match";
import { Suspense } from "react";

export default function FlashcardMatchingPage() {
  return (
    <AuthWrapper>
      <Suspense>
        <FlashcardMatching />
      </Suspense>
    </AuthWrapper>
  );
}
