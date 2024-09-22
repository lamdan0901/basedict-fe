"use client";

import { AuthWrapper } from "@/components/AuthWrapper";
import { JLPTTest } from "@/modules/quizzes/jlpt-test/test-item";
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
