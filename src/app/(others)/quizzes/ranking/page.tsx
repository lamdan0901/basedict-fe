import { QuizRanking } from "@/modules/quizzes/ranking";

export default function RankingPage() {
  if (process.env.NODE_ENV === "production")
    return <div>Tính năng này sẽ ra mắt sớm</div>;

  return <QuizRanking />;
}
