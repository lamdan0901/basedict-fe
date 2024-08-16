import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";

const descriptions = [
  {
    title: "1. Bài đọc ngắn (短文読解 ）",
    length: "Thường là một đoạn văn ngắn, từ 50 đến 200 từ.",
    purpose: "Kiểm tra khả năng nắm bắt ý chính và các chi tiết cụ thể.",
    level: "N5 đến N3.",
  },
  {
    title: "2. Bài đọc trung bình (中文読解)",
    length: "Khoảng 200 đến 500 từ.",
    purpose:
      "Kiểm tra khả năng hiểu và phân tích các thông tin trong đoạn văn.",
    level: "N4, N3 và N2.",
  },
  {
    title: "3. Bài đọc dài (長文読解)",
    length: "Trên 500 từ.",
    purpose:
      "Đánh giá khả năng đọc hiểu toàn diện, bao gồm việc nắm bắt các ý chính, chi tiết, và suy luận từ ngữ cảnh.",
    level: "N2 và N1.",
  },
  {
    title: "4. Bài đọc thực tế (実用的読解)",
    length: "Thường ngắn hoặc trung bình.",
    purpose:
      "Kiểm tra khả năng hiểu văn bản trong các tình huống thực tế, thường gặp trong cuộc sống hàng ngày hoặc công việc ( thông báo, email, bảng chỉ dẫn, hoặc tin nhắn)",
    level: "N5 đến N1.",
  },
  {
    title: "5. Bài đọc suy luận (推論問題)",
    length: "Trung bình hoặc dài.",
    purpose:
      "Kiểm tra khả năng phân tích, suy luận và đưa ra kết luận từ thông tin gián tiếp.",
    level: "N2 và N1.",
  },
  {
    title: "6. Bài đọc tóm tắt (要約問題）",
    length: "Thường là đoạn văn trung bình hoặc dài.",
    purpose:
      "Đánh giá khả năng tóm tắt thông tin và hiểu được ý chính của đoạn văn.",
    level: "N3, N2, và N1.",
  },
  {
    title: "7. Bài đọc đồ họa, biểu đồ（グラフ・図表読解",
    length: "Ngắn hoặc trung bình.",
    purpose:
      "Kiểm tra khả năng hiểu thông tin được trình bày dưới dạng đồ họa hoặc số liệu, và cách giải thích những thông tin đó trong ngữ cảnh.",
    level: "N2 và N1.",
  },
];

export function JLPTReadingDescModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"link"} className="mb-3 underline p-0 ml-6 pt-4">
          Các dạng bài đọc JLPT <CircleHelp className="size-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby=""
        className="overflow-auto w-full max-h-[100dvh] sm:min-w-[825px]"
      >
        <DialogHeader>
          <DialogTitle>Các dạng bài đọc JLPT</DialogTitle>
        </DialogHeader>
        <div className="">
          Tùy thuộc vào cấp độ (N5 đến N1), các dạng bài đọc có thể khác nhau về
          độ khó, độ dài và nội dung. Dưới đây là các dạng bài đọc phổ biến
          thường gặp trong kỳ thi JLPT:
          {descriptions.map((d) => (
            <div key={d.title} className="mt-2">
              <h3 className="font-bold">{d.title}</h3>
              <ul>
                <li className="">
                  <b>・Độ dài:</b> {d.length}
                </li>
                <li className="">
                  <b>・Mục đích:</b> {d.purpose}
                </li>
                <li className="">
                  <b>・Cấp độ:</b> {d.level}
                </li>
              </ul>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
