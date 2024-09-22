"use client";

import { AuthWrapper } from "@/components/AuthWrapper";
import { BasedictTest } from "@/modules/quizzes/basedict-test/TestItem";

export default function BasedictTestPage() {
  return (
    <AuthWrapper>
      <BasedictTest />
    </AuthWrapper>
  );
}
