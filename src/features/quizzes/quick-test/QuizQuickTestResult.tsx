import { Card, CardContent } from "@/components/ui/card";
import { CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  title: string;
  level: string;
  quesLength: number;
  correctAnswers: number;
  onShowCorrectAns: () => void;
  onRetake: () => void;
};

export function QuizQuickTestResult({
  title,
  level,
  quesLength,
  correctAnswers,
  onShowCorrectAns,
  onRetake,
}: Props) {
  return (
    <CarouselItem>
      <Card>
        <CardContent className="flex aspect-square flex-col gap-4 sm:aspect-video items-center justify-center p-6">
          <h2 className="font-semibold text-xl sm:text-2xl">
            Chúc mừng, bạn đã hoàn thành đề thi
          </h2>

          <div className="w-fit mx-auto border-2 py-4 px-8 border-black mt-3">
            <div className="font-semibold mx-auto w-fit text-lg">
              Kết quả làm đề thi
            </div>
            <div>
              <span className="w-[140px] inline-block">Đề thi:</span>
              <span className="font-semibold">{title}</span>
            </div>
            <div>
              <span className="w-[140px] inline-block">Cấp độ: </span>
              <span className="font-semibold">{level}</span>
            </div>
            <div>
              <span className="w-[140px] inline-block">Số câu đúng:</span>
              <span className="font-semibold">
                {correctAnswers}/{quesLength}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center flex-wrap gap-3">
            <Button onClick={onShowCorrectAns} variant={"outline"}>
              Xem đáp án
            </Button>
            <Button onClick={onRetake} variant={"outline"}>
              Bắt đầu lại
            </Button>
            <Link href="/quizzes/search">
              <Button variant={"outline"}>Tìm kiếm bộ đề khác</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </CarouselItem>
  );
}
