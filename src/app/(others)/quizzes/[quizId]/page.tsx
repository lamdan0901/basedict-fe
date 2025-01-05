import { AuthWrapper } from "@/widgets/auth";
import { QuizDetail } from "@/features/quizzes/detail";

export default function QuizDetailPage() {
  return (
    <AuthWrapper>
      <QuizDetail />
    </AuthWrapper>
  );
}
