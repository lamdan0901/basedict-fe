import { QuizGeneralInfo } from "@/modules/quizzes/general";

export default function GeneralInfoPage() {
  if (process.env.NODE_ENV === "production")
    return <div>Tính năng này sẽ ra mắt sớm</div>;

  return <QuizGeneralInfo />;
}
