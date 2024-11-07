"use client";

import { AdSense } from "@/components/Ad";
import { ShuffleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DialogClose,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { shuffleArray } from "@/lib";
import { RegisterRequiredWrapper } from "@/modules/quizzes/components/RegisterRequiredWrapper";
import { QuizCarouselItem } from "@/modules/quizzes/quick-test/QuizCarouselItem";
import { getRequest } from "@/service/data";
import { useAppStore } from "@/store/useAppStore";
import { Check, CircleHelp } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";

export function QuizQuickTest() {
  const { toast } = useToast();
  const isSmScreen = useMediaQuery("(max-width: 640px)");
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [currentExplanation, setCurrentExplanation] = useState("");
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  console.log("userAnswers: ", userAnswers);

  const { quizId } = useParams();
  const userId = useAppStore((state) => state.profile?.id);

  const [showingCorrectAns, setShowingCorrectAns] = useState(false);
  const [quizRegisterPromptOpen, setQuizRegisterPromptOpen] = useState(false);

  const { data: quiz, isLoading } = useSWR<TQuiz>(
    userId && quizId ? `/v1/exams/${quizId}` : null,
    getRequest
  );

  const questions = useMemo(() => {
    return shuffleArray(quiz?.questions ?? []);
  }, [quiz?.questions]);

  const isMyQuiz = userId === quiz?.owner?.id;

  useEffect(() => {
    if (!isLoading && !isMyQuiz && !quiz?.isLearning) {
      setQuizRegisterPromptOpen(true);
    }
  }, [isLoading, quiz?.isLearning, isMyQuiz]);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        api?.scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        api?.scrollNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [api]);

  const showExplanation = useCallback((item: TQuizQuestion) => {
    setCurrentExplanation(item.explanation);
  }, []);

  const handleSelectAnswer = useCallback((id: number, ans: string) => {
    console.log("handleSelectAnswer", id, ans);
    setUserAnswers((prev) => ({ ...prev, [id]: ans }));
  }, []);

  if (isLoading) return <div>Đang tải đề thi...</div>;
  if (!quiz) return <div>Không tìm thấy đề thi</div>;

  return (
    <RegisterRequiredWrapper
      open={quizRegisterPromptOpen}
      onOpenChange={setQuizRegisterPromptOpen}
    >
      <div className="flex sm:flex-row flex-col gap-2">
        <div className="max-w-[calc(100%-76px)] w-full sm:max-w-lg md:max-w-xl xl:max-w-3xl ml-9 sm:ml-12 space-y-4">
          <div className="flex relative items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                checked={showingCorrectAns}
                onCheckedChange={setShowingCorrectAns}
                id="airplane-mode"
              />
              <Label htmlFor="airplane-mode">Hiện đáp án ngay</Label>
            </div>
            <div className="text-sm absolute left-1/2 -translate-x-1/2 top-7 sm:top-[unset] text-muted-foreground">
              {current} / {count}
            </div>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button size={"sm"} className="rounded-full" variant="ghost">
                    <CircleHelp className="size-5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs sm:max-w-sm">
                    Các câu hỏi trong bộ đề sẽ được trộn ngẫu nhiên thứ tự mỗi
                    lần bạn bắt đầu. <br />
                    Sử dụng các nút trên màn hình để di chuyển giữa các thẻ: nút
                    'Back' để quay lại câu hỏi trước trước và nút 'Next' để
                    chuyển sang câu hỏi tiếp theo. <br />
                    Nếu sử dụng bàn phím, bạn có thể ấn phím sang trái để quay
                    lại thẻ trước, phím sang phải để chuyển sang câu hỏi tiếp
                    theo, và phím dấu cách để xem đáp án. <br />
                    Nếu bạn bật chế độ <i>Hiện đáp án ngay</i> thì ngay khi bạn
                    chọn đáp án, bạn sẽ biết đáp án của bạn là đúng hay sai.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
              {questions.map((item, index) => (
                <QuizCarouselItem
                  key={index}
                  item={item}
                  showingCorrectAns={showingCorrectAns}
                  onShowExplanation={() => showExplanation(item)}
                  onSelectAns={handleSelectAnswer}
                  userSelectedAns={userAnswers[item.id]}
                />
              ))}
            </CarouselContent>
            <CarouselPrevious
              className="sm:size-14 sm:-left-16"
              iconClassName="sm:size-8"
            />
            <CarouselNext
              className="sm:size-14 sm:-right-16"
              iconClassName="sm:size-8"
            />
          </Carousel>
        </div>

        <Dialog
          open={!!currentExplanation}
          onOpenChange={() => setCurrentExplanation("")}
        >
          <DialogContent
            aria-describedby="show-explanation"
            className="max-w-sm"
          >
            <DialogHeader>
              <DialogTitle className="font-semibold mx-auto w-fit text-lg">
                Giải thích đáp án
              </DialogTitle>
            </DialogHeader>
            <div className="">{currentExplanation}</div>
            <DialogFooter>
              <DialogClose>Đóng</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {isSmScreen ? (
          <AdSense slot="horizontal" />
        ) : (
          <AdSense slot="vertical" />
        )}
      </div>
    </RegisterRequiredWrapper>
  );
}
