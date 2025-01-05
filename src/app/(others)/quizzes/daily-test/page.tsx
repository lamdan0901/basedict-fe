"use client";

import { AuthWrapper } from "@/widgets/auth";
import { DailyTest } from "@/features/quizzes/daily-test";

export default function DailyTestPage() {
  return (
    <AuthWrapper>
      <DailyTest />
    </AuthWrapper>
  );
}
