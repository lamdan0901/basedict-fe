import { JLPTTests } from "@/modules/quizzes/jlpt-test/test-list";
import { ResolvingMetadata } from "next";

const fetchJlptTests = async (jlptLevel = "N1") => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/v1/exams/jlpt?jlptLevel=${jlptLevel}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data;
  } catch (err: any) {
    console.log("err fetchJlptTests: ", err);
    return [];
  }
};

export async function generateMetadata(_: any, parent: ResolvingMetadata) {
  const previousMeta = await parent;
  return {
    ...previousMeta,
    title: "BaseDict | Đề thi JLPT các năm",
    description: `Trang web luyện thi JLPT giúp bạn ôn tập hiệu quả với các bộ đề thi JLPT từ những năm trước. Đầy đủ các cấp độ từ N5 đến N1, kèm theo dịch và giải thích chi tiết từng câu hỏi. Chuẩn bị tốt nhất cho kỳ thi JLPT sắp tới của bạn!`,
    keywords: `luyện thi JLPT, đề thi JLPT, đề thi JLPT các năm trước, đề thi JLPT N1, đề thi JLPT N2, đề thi JLPT N3, đề thi JLPT N4, đề thi JLPT N5, ôn thi JLPT, giải đề JLPT, kỳ thi JLPT, thi tiếng Nhật`,
  };
}

export default async function JlptTestsPage({ searchParams }: TComponentProps) {
  const { jlptLevel } = searchParams;
  const jlptTests = await fetchJlptTests(jlptLevel);

  return (
    <JLPTTests
      jlptTests={jlptTests}
      jlptLevel={jlptLevel as TJlptLevel | undefined}
    />
  );
}
