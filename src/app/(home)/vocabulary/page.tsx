import { Vocabulary } from "@/modules/vocabulary";
import { ResolvingMetadata } from "next";

export async function generateMetadata(_: any, parent: ResolvingMetadata) {
  const previousMeta = await parent;
  return {
    ...previousMeta,
    title: "BaseDict | Từ vựng JLPT",
    description: `Danh sách từ vựng JLPT cấp độ. Bao gồm tất cả từ vựng JLPT theo cấp độ từ N5 đến N1 giúp bạn ôn thi tiếng Nhật hiệu quả. Cập nhật đầy đủ từ vựng kèm giải thích chi tiết, hỗ trợ học và chuẩn bị cho kỳ thi JLPT. Dễ dàng tìm kiếm từ vựng theo cấp độ phù hợp với trình độ của bạn.`,
    keywords: `Từ vựng JLPT N1, từ vựng JLPT N2, từ vựng JLPT N3, từ vựng JLPT N4, từ vựng JLPT N5, từ vựng theo cấp độ, từ vựng tiếng nhật, từ điển nhật việt`,
  };
}

export default function VocabPage() {
  return <Vocabulary />;
}
