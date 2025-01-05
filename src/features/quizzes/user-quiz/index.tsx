"use client";

import { AdSense } from "@/components/ui/ad";
import { QuizItem } from "@/features/quizzes/components/QuizItem";
import { UserQuizHeader } from "@/features/quizzes/components/UserQuizHeader";

export function UserQuiz({ owner }: { owner: TQuizCreator | undefined }) {
  const exams = owner?.exams ?? [];
  const total = exams?.length ?? 0;

  return (
    <div>
      <div className="space-y-4">
        <UserQuizHeader
          avatar={owner?.avatar}
          name={owner?.name}
          totalSet={total}
          totalLearningNumber={owner?.totalLearningNumber}
          totalLearnedNumber={owner?.totalLearnedNumber}
        />

        <div className="grid gap-4 xl:grid-cols-2">
          {exams.map((quiz) => (
            <QuizItem key={quiz.id} quiz={quiz} />
          ))}
        </div>
      </div>

      <AdSense slot="horizontal" />
    </div>
  );
}
