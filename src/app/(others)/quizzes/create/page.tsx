import { AuthWrapper } from "@/components/AuthWrapper";
import { QuizCreation } from "@/modules/quizzes/create";

export default function QuizCreationPage() {
  return (
    <AuthWrapper>
      <QuizCreation />
    </AuthWrapper>
  );
}
