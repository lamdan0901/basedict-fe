"use client";

import { AuthWrapper } from "@/components/AuthWrapper";
import { FlashcardMatching } from "@/modules/flashcard/match";
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
