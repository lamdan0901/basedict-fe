"use client";

import { AuthWrapper } from "@/components/AuthWrapper";
import { JLPTTest } from "@/modules/quizzes/jlpt-test/test-item";

export default function JlptTestPage() {
  return (
    <AuthWrapper>
      <JLPTTest />
    </AuthWrapper>
  );
}
