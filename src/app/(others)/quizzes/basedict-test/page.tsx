import { QuizBasedictTest } from "@/modules/quizzes/basedict-test";
import { ResolvingMetadata } from "next";

export async function generateMetadata(_: any, parent: ResolvingMetadata) {
  const previousMeta = await parent;
  return {
    ...previousMeta,
    title: "BaseDict | Luyện thi JLPT",
    description: `Khám phá bộ đề thi JLPT tự soạn độc quyền từ hệ thống của chúng tôi. Tập trung vào tất cả các cấp độ từ N5 đến N1, giúp bạn chuẩn bị một cách hiệu quả và toàn diện cho kỳ thi JLPT. Trải nghiệm đề thi chất lượng cao và nâng cao khả năng tiếng Nhật của bạn!`,
    keywords: `đề thi JLPT tự soạn, bộ đề JLPT độc quyền, luyện thi JLPT, ôn thi JLPT, đề thi JLPT N1, đề thi JLPT N2, đề thi JLPT N3, đề thi JLPT N4, đề thi JLPT N5, thi tiếng Nhật, luyện đề JLPT`,
  };
}

export default function BasedictTestPage() {
  return null
  // return <QuizBasedictTest />;
}
