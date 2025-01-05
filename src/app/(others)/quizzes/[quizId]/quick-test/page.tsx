import { AuthWrapper } from "@/widgets/auth";
import { QuizQuickTest } from "@/features/quizzes/quick-test";

export default function QuizQuickTestPage() {
  return (
    <AuthWrapper>
      <QuizQuickTest />
    </AuthWrapper>
  );
}
