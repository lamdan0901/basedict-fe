"use client";

import { AdSense } from "@/components/Ad";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { shuffleArray } from "@/lib";
import { RegisterRequiredWrapper } from "@/modules/quizzes/components/RegisterRequiredWrapper";
import { QuizCarouselItem } from "@/modules/quizzes/quick-test/QuizCarouselItem";
import { QuizQuickTestResult } from "@/modules/quizzes/quick-test/QuizQuickTestResult";
import { QuizQuickTestTopBar } from "@/modules/quizzes/quick-test/QuizQuickTestTopbar";
import { getRequest } from "@/service/data";
import { useAppStore } from "@/store/useAppStore";
import { CircleHelp } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";

export function QuizQuickTest() {
  const isSmScreen = useMediaQuery("(max-width: 640px)");
  const [api, setApi] = useState<CarouselApi>();
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [currentExplanation, setCurrentExplanation] = useState("");
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

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

  const correctAnswers = useMemo(
    () =>
      questions?.reduce((acc, question) => {
        if (question.correctAnswer === userAnswers[question.id]) {
          return acc + 1;
        }
        return acc;
      }, 0),
    [questions, userAnswers]
  );

  useEffect(() => {
    if (!isLoading && !isMyQuiz && !quiz?.isLearning) {
      setQuizRegisterPromptOpen(true);
    }
  }, [isLoading, quiz?.isLearning, isMyQuiz]);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrentCarouselIndex(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrentCarouselIndex(api.selectedScrollSnap() + 1);
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

  const handleShowExplanation = useCallback((explanation: string) => {
    setCurrentExplanation(explanation);
  }, []);

  const handleSelectAnswer = useCallback((id: number, ans: string) => {
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
          <QuizQuickTestTopBar
            showingCorrectAns={showingCorrectAns}
            onShowingCorrectAns={setShowingCorrectAns}
            count={count}
            currentCarouselIndex={currentCarouselIndex}
          />

          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
              {questions.map((item, index) => (
                <QuizCarouselItem
                  key={index}
                  item={item}
                  showingCorrectAns={showingCorrectAns}
                  userSelectedAns={userAnswers[item.id]}
                  onSelectAns={handleSelectAnswer}
                  onShowExplanation={handleShowExplanation}
                />
              ))}
              <QuizQuickTestResult
                title={quiz?.title}
                level={quiz.jlptLevel}
                quesLength={questions.length}
                correctAnswers={correctAnswers}
              />
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
            <div className="whitespace-pre-line">{currentExplanation}</div>
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
