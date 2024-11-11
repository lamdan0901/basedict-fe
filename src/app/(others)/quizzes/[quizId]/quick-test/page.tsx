import { AuthWrapper } from "@/components/AuthWrapper";
import { QuizQuickTest } from "@/modules/quizzes/quick-test";

export default function QuizQuickTestPage() {
  return (
    <AuthWrapper>
      <QuizQuickTest />
    </AuthWrapper>
  );
}
