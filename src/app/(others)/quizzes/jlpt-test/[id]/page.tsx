"use client";

import { AuthWrapper } from "@/widgets/auth";
import { JLPTTest } from "@/features/quizzes/jlpt-test/test-item";
import { Suspense } from "react";

export default function JlptTestPage() {
  return (
    <AuthWrapper>
      <Suspense>
        <JLPTTest />
      </Suspense>
    </AuthWrapper>
  );
}
