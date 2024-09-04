import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@radix-ui/react-dialog";

export function JLPTTestDescModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"link"} className="mb-3 underline p-0 ml-1 pt-4">
          Các dạng đề thi JLPT <CircleHelp className="size-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby=""
        className="overflow-auto max-h-[100dvh] min-w-full md:min-w-[800px]"
      >
        <DialogHeader>
          <DialogTitle>Các dạng đề thi JLPT</DialogTitle>
        </DialogHeader>
        <div className="">
          <div>
            Trang web luyện thi JLPT của chúng tôi cung cấp các bài thi mô phỏng
            dựa trên cấu trúc thực tế của kỳ thi JLPT, được thiết kế đặc biệt để
            giúp bạn chuẩn bị tốt nhất cho các cấp độ N1, N2, và N3. Dưới đây là
            cấu trúc đề thi cho từng cấp độ:
          </div>
          <h2 className="text-lg font-semibold">Cấp độ N1:</h2>
          <div>
            ・Kanji to Hiragana: 6 câu hỏi.
            <br /> Bạn sẽ chuyển đổi từ Kanji sang Hiragana, kiểm tra khả năng
            nhận diện và hiểu ý nghĩa của Kanji.
            <br />
            ・Lexeme: 7 câu hỏi.
            <br /> Kiểm tra sự hiểu biết về từ vựng, cách sử dụng từ trong ngữ
            cảnh khác nhau.
            <br /> ・Synonym: 6 câu hỏi.
            <br /> Tìm từ đồng nghĩa, giúp bạn hiểu rõ hơn về sắc thái ý nghĩa
            của từ.
            <br /> ・Context Lexeme: 6 câu hỏi.
            <br /> Tìm từ phù hợp nhất trong một ngữ cảnh cụ thể.
            <br />
            ・Grammar: 10 câu hỏi.
            <br /> Kiểm tra kiến thức ngữ pháp, khả năng áp dụng vào câu.
            <br /> ・Grammar Align: 5 câu hỏi.
            <br /> Bạn sẽ sắp xếp các phần của câu sao cho đúng ngữ pháp và ý
            nghĩa.
            <br />
          </div>
          <h2 className="text-lg font-semibold">Cấp độ N2:</h2>
          <div>
            ・Kanji to Hiragana: 5 câu hỏi. <br />
            ・Hiragana to Kanji: 5 câu hỏi. <br />
            Kiểm tra khả năng viết Kanji từ Hiragana. <br />
            ・Suffix Prefix: 3 câu hỏi. <br />
            Xác định tiền tố/hậu tố phù hợp với từ vựng. <br />
            ・Lexeme: 7 câu hỏi. <br />
            ・Synonym: 5 câu hỏi. <br />
            ・Context Lexeme: 5 câu hỏi. <br />
            ・Grammar: 12 câu hỏi. <br />
            ・Grammar Align: 5 câu hỏi. <br />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
