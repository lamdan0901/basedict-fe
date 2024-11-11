import { UserQuiz } from "@/modules/quizzes/user-quiz";
import { ResolvingMetadata } from "next";

const fetchUserQuiz = async (userId?: string) => {
  if (!userId) return;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/v1/exams/user/${userId}`
    );
    if (!res.ok) return;
    const data = await res.json();
    return data.data as TQuizCreator;
  } catch (err: any) {
    console.log("err fetchFlashcardSet: ", err);
  }
};

export async function generateMetadata(
  { params }: TComponentProps,
  parent: ResolvingMetadata
) {
  const [owner, previousMeta] = await Promise.all([
    fetchUserQuiz(params.flashcardId),
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
  const owner = await fetchUserQuiz(params.userId);
  return <UserQuiz owner={owner} />;
}
