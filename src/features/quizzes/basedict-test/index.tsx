import { AdSense } from "@/components/ui/ad";
import { Card, CardContent } from "@/components/ui/card";
import { LevelSelector } from "@/features/quizzes/basedict-test/LevelSelector";

export function QuizBasedictTest() {
  return (
    <Card>
      <CardContent className="space-y-8 max-w-3xl mx-auto pb-12 mt-4">
        <h2 className="font-semibold text-2xl mx-auto w-fit">
          Luyện thi Basedict
        </h2>

        <LevelSelector />

        <div className="">
          <h3 className="font-semibold mb-6 w-fit mx-auto">
            Chào mừng bạn đến với trang bộ đề thi JLPT tự soạn độc quyền của
            chúng tôi!
          </h3>
          <p>
            Tại đây, chúng tôi đã thiết kế và biên soạn các bộ đề thi JLPT từ N5
            đến N1, dựa trên kinh nghiệm và sự hiểu biết sâu sắc về cấu trúc và
            nội dung của kỳ thi JLPT. Những bộ đề này không chỉ mô phỏng sát với
            đề thi thực tế mà còn được thiết kế để tập trung vào những điểm ngữ
            pháp, từ vựng và kỹ năng mà thí sinh thường gặp khó khăn.
            <br />
            <br />
            Mục tiêu của chúng tôi là giúp bạn luyện tập một cách toàn diện, từ
            đó tăng cường sự tự tin và khả năng làm bài thi của bạn. Hãy trải
            nghiệm các bộ đề thi chất lượng cao của chúng tôi và nâng cao khả
            năng tiếng Nhật của bạn một cách hiệu quả nhất!
          </p>
        </div>
      </CardContent>

      <AdSense slot="horizontal" />
    </Card>
  );
}
