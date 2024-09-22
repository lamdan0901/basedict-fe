"use client";

import { AuthWrapper } from "@/components/AuthWrapper";
import { DailyTest } from "@/modules/quizzes/daily-test";

export default function DailyTestPage() {
  return (
    <AuthWrapper>
      <DailyTest />
    </AuthWrapper>
  );
}
