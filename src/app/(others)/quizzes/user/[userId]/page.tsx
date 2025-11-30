import { UserQuiz } from "@/modules/quizzes/user-quiz";
import { ResolvingMetadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { createQuizRepository } from "@/lib/supabase/repositories/quizRepo";

export async function generateMetadata(
  { params }: TComponentProps,
  parent: ResolvingMetadata
) {
  const supabase = createClient();
  const quizRepo = createQuizRepository(supabase);
  const [owner, previousMeta] = await Promise.all([
    params.userId
      ? quizRepo.getUserQuizzes(params.userId)
      : Promise.resolve(undefined),
    parent,
  ]);

  if (!owner) return previousMeta;

  return {
    ...previousMeta,
    title: `BaseDict | Đề thi JLPT Tiếng Nhật. Bộ đề của ${owner.name}`,
    description: `Danh sách các đề thi của ${owner.name}`,
    keyword: "Đề thi JLPT tiếng Nhật",
  };
}

export default async function UserQuizPage({ params }: TComponentProps) {
  if (!params.userId) return null;
  const supabase = createClient();
  const quizRepo = createQuizRepository(supabase);
  const owner = await quizRepo.getUserQuizzes(params.userId);
  return <UserQuiz owner={owner} />;
}
