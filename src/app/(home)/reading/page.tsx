import { Reading } from "@/modules/reading";
import { ResolvingMetadata } from "next";

export async function generateMetadata(
  _: TComponentProps,
  parent: ResolvingMetadata
) {
  const previousMeta = await parent;

  return {
    ...previousMeta,
    title: `BaseDict | Luyện Đọc Tiếng Nhật Song Ngữ Việt Nhật | JLPT N1-N5 | Bài Đọc JLPT Cũ`,
    description: `Trang web luyện đọc tiếng Nhật với các bài đọc song ngữ Việt Nhật, phân theo cấp độ JLPT từ N1 đến N5. Bao gồm các bài đọc từ đề thi JLPT các năm trước và tính năng dịch từ trực tiếp trên bài đọc, giúp bạn nâng cao kỹ năng đọc hiểu và từ vựng một cách hiệu quả.`,
    keyword:
      "luyện đọc tiếng Nhật, JLPT N1, JLPT N2, JLPT N3, JLPT N4, JLPT N5, đọc hiểu JLPT, luyện đọc song ngữ Việt Nhật, đề thi JLPT cũ, dịch từ tiếng Nhật, đọc hiểu tiếng Nhật",
  };
}

export default function ReadingPage() {
  return <Reading />;
}
