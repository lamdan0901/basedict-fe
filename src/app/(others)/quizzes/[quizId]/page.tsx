import { AuthWrapper } from "@/components/AuthWrapper";
import { QuizDetail } from "@/modules/quizzes/detail";

export default function QuizDetailPage() {
  return (
    <AuthWrapper>
      <QuizDetail />
    </AuthWrapper>
  );
}
