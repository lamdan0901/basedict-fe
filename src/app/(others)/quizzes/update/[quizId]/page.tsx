"use client";

import { AuthWrapper } from "@/widgets/auth";
import { QuizCreation } from "@/features/quizzes/create";

export default function QuizUpdatePage() {
  return (
    <AuthWrapper>
      <QuizCreation />
    </AuthWrapper>
  );
}
