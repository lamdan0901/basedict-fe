import { JLPTTests } from "@/features/quizzes/jlpt-test/test-list";
import { ResolvingMetadata } from "next";
import { Suspense } from "react";

export async function generateMetadata(_: any, parent: ResolvingMetadata) {
  const previousMeta = await parent;
  return {
    ...previousMeta,
    title: "BaseDict | Đề thi JLPT các năm",
    description: `Trang web luyện thi JLPT giúp bạn ôn tập hiệu quả với các bộ đề thi JLPT từ những năm trước. Đầy đủ các cấp độ từ N5 đến N1, kèm theo dịch và giải thích chi tiết từng câu hỏi. Chuẩn bị tốt nhất cho kỳ thi JLPT sắp tới của bạn!`,
    keywords: `luyện thi JLPT, đề thi JLPT, đề thi JLPT các năm trước, đề thi JLPT N1, đề thi JLPT N2, đề thi JLPT N3, đề thi JLPT N4, đề thi JLPT N5, ôn thi JLPT, giải đề JLPT, kỳ thi JLPT, thi tiếng Nhật`,
  };
}

export default async function JlptTestsPage() {
  return (
    <Suspense>
      <JLPTTests />
    </Suspense>
  );
}
