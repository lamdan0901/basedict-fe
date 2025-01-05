import { AdSense } from "@/components/ui/ad";
import { Card, CardContent } from "@/components/ui/card";
import { ResolvingMetadata } from "next";

export async function generateMetadata(_: any, parent: ResolvingMetadata) {
  const previousMeta = await parent;
  return {
    ...previousMeta,
    title: "BaseDict | Cấu Trúc Đề Thi JLPT",
    description: `Hướng dẫn chi tiết cấu trúc đề thi JLPT N1, N2, N3 chính xác. Cung cấp bài thi thử JLPT miễn phí giúp bạn chuẩn bị tốt nhất cho kỳ thi. Cấu trúc bao gồm 4 phần chính, phần từ vựng, ngữ pháp, phần đọc hiểu, phần nghe hiểu ...`,
    keywords: `JLPT N1, JLPT N2, JLPT N3, thi thử JLPT, luyện thi JLPT, cấu trúc đề thi JLPT,đề thi JLPT, bộ đề thi JLPT, ôn tập JLPT, thi thử miễn phí, thi tiếng Nhật online`,
  };
}

export default function JlptQuestionTypesPage() {
  return (
    <Card>
      <CardContent>
        <h1 className="text-2xl mt-6 text-center font-semibold">
          Cấu Trúc Bộ Đề Thi JLPT
        </h1>
        <br />
        <div>
          Chào mừng bạn đến với trang hướng dẫn cấu trúc bộ đề thi JLPT của
          chúng tôi! Dưới đây là giải thích chi tiết về cấu trúc các bộ đề thi
          cho các trình độ N1, N2 và N3.
        </div>
        <br />

        <h2 className="text-xl font-semibold">
          Cách dạng bài xuất hiện trong đề thi JLPT
        </h2>

        <div className="ml-3">
          <h3 className="text-lg font-semibold">Phần từ vựng</h3>
          ・Kanji To Hiragana: Loại câu hỏi này kiểm tra khả năng đọc hiểu chữ
          Kanji bằng cách yêu cầu chuyển đổi từ Kanji thành Hiragana.
          <br />
          ・Hiragana To Kanji: Ngược lại với câu hỏi trên, loại này yêu cầu chọn
          chữ Kanji đúng khi được cung cấp từ dưới dạng Hiragana.
          <br />
          ・Lexeme (Từ vựng): Các câu hỏi này yêu cầu thí sinh đúng từ phù hợp
          với câu hỏi
          <br />
          ・Synonym (Từ đồng nghĩa): Thí sinh phải chọn từ có nghĩa tương đương
          với từ cho trước, giúp kiểm tra khả năng nhận diện và hiểu từ đồng
          nghĩa.
          <br />
          ・SuffixPrefix (Hậu tố/ Tiền tố): Loại câu hỏi này yêu cầu thí sinh
          xác định từ vựng với hậu tố hoặc tiền tố phù hợp, kiểm tra sự hiểu
          biết về cấu tạo từ.
          <br />
          ・ContextLexeme (Từ vựng theo ngữ cảnh): Câu hỏi này sẽ đưa ra 1 từ
          cho trước và yêu cầu thí sinh chọn đúng văn cảnh tương ứng phù hợp với
          từ đó
          <br />
          <br />
        </div>

        <div className="ml-3">
          <h3 className="text-lg font-semibold"> Phần ngữ pháp</h3>
          ・Grammar (Ngữ pháp): Thí sinh phải chọn cấu trúc ngữ pháp đúng trong
          câu, kiểm tra kiến thức và khả năng áp dụng ngữ pháp.
          <br />
          ・GrammarAlign (Sắp xếp ngữ pháp): Thí sinh được yêu cầu hoàn thiện
          câu với các thành phần cho trước.
          <br />
          <br />
        </div>

        <div className="ml-3">
          <h3 className="text-lg font-semibold">Phần đọc hiểu</h3>
          ・GrammarReading (bài đọc ngữ pháp): Bài đọc tập trung vào cấu trúc
          ngữ pháp, giúp kiểm tra khả năng hiểu và áp dụng ngữ pháp trong văn
          bản.
          <br />
          ・SummaryReading (bài đọc tóm tắt): Bài đọc yêu cầu thí sinh nắm bắt ý
          chính và nội dung bài viết, đánh giá khả năng tóm tắt thông tin.
          <br />
          ・MediumReading (bài đọc trung bình): Đoạn văn có độ dài trung bình
          với nội dung phức tạp, kiểm tra khả năng hiểu ngữ pháp và từ vựng
          trong văn bản dài hơn.
          <br />
          ・LongReading (bài đọc dài): Đánh giá khả năng đọc hiểu toàn diện, bao
          gồm việc nắm bắt các ý chính, chi tiết, và suy luận từ ngữ cảnh.
          <br />
          ・CompareReading (bài đọc so sánh): Bài đọc so sánh nội dung giữa các
          văn bản, giúp đánh giá khả năng phân tích và đối chiếu thông tin.
          <br />
          ・NoticeReading (bài đọc thông báo, bảng biểu): Đọc hiểu các thông báo
          hoặc bảng biểu ngắn, mang tính chất thông báo, kiểm tra khả năng tiếp
          nhận thông tin mà văn bản truyền đạt một cách nhanh chóng.
          <br />
          <br />
        </div>

        <div className="ml-3">
          <h3 className="text-lg font-semibold"> Phần nghe hiểu</h3>・Đang cập
          nhật
        </div>
        <br />

        <h2 className="text-xl font-semibold">Cấu trúc đề thi</h2>
        <div className="grid grid-cols-1 gap-8 lg:gap-4 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold">Trình độ N1</h3>
            ・Từ vựng:
            <br />
            KanjiToHiragana: 6 câu hỏi
            <br /> Lexeme: 7 câu hỏi
            <br /> Synonym: 6 câu hỏi
            <br />
            ContextLexeme: 6 câu hỏi
            <br />
            <br />
            ・Ngữ pháp: <br /> Grammar: 10 câu hỏi
            <br /> GrammarAlign: 5 câu hỏi
            <br />
            <br />
            ・Đọc hiểu: <br /> GrammarReading: 1 bài đọc
            <br /> SummaryReading: 4 bài đọc
            <br />
            MediumReading: 4 bài đọc
            <br /> LongReading: 2 bài đọc
            <br /> CompareReading: 1 bài đọc
            <br /> NoticeReading: 1 bài đọc
            <br />
            <br />
            ・Nghe hiểu: <br /> Đang cập nhật
          </div>
          <div>
            <h3 className="text-lg font-semibold">Trình độ N2</h3>
            ・Từ vựng: <br />
            KanjiToHiragana: 5 câu hỏi
            <br /> HiraganaToKanji: 5 câu hỏi
            <br /> SuffixPrefix: 3 câu hỏi
            <br /> Lexeme: 7 câu hỏi
            <br /> Synonym: 5 câu hỏi
            <br /> ContextLexeme: 5 câu hỏi
            <br />
            <br />
            ・Ngữ pháp: <br />
            Grammar: 12 câu hỏi
            <br /> GrammarAlign: 5 câu hỏi
            <br />
            <br />
            ・Đọc hiểu: <br />
            GrammarReading: 1 bài đọc
            <br /> SummaryReading: 5 bài đọc
            <br /> MediumReading: 4 bài đọc
            <br /> CompareReading: 1 bài đọc
            <br /> LongReading: 1 bài đọc
            <br />
            NoticeReading: 0 bài đọc
            <br />
            <br />
            ・Nghe hiểu: <br />
            Đang cập nhật
          </div>
          <div>
            <h3 className="text-lg font-semibold">Trình độ N3</h3>
            ・Từ vựng: <br />
            KanjiToHiragana: 8 câu hỏi
            <br />
            HiraganaToKanji: 6 câu hỏi
            <br />
            Lexeme: 11 câu hỏi
            <br />
            Synonym: 5 câu hỏi
            <br />
            ContextLexeme: 5 câu hỏi <br />
            <br />
            ・Ngữ pháp: <br />
            Grammar: 13 câu hỏi
            <br />
            GrammarAlign: 5 câu hỏi <br />
            <br />
            ・Đọc hiểu: <br />
            GrammarReading: 1 bài đọc
            <br />
            SummaryReading: 4 bài đọc
            <br />
            MediumReading: 2 bài đọc
            <br />
            LongReading: 1 bài đọc
            <br />
            NoticeReading: 0 bài đọc <br />
            <br />
            ・Nghe hiểu: <br />
            Đang cập nhật
          </div>
        </div>
        <div className="w-fit mt-6 ml-auto">
          BaseDict
          <br />
          7/9/2024
        </div>
      </CardContent>

      <AdSense slot="horizontal" />
    </Card>
  );
}
