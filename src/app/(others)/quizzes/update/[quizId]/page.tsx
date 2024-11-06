"use client";

import { AuthWrapper } from "@/components/AuthWrapper";
import { QuizCreation } from "@/modules/quizzes/create";

export default function QuizUpdatePage() {
  return (
    <AuthWrapper>
      <QuizCreation />
    </AuthWrapper>
  );
}
