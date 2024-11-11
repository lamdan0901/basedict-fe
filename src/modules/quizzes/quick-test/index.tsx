"use client";

import { AdSense } from "@/components/Ad";
import {
  Carousel,
  CarouselContent,
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
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { shuffleArray } from "@/lib";
import { RegisterRequiredWrapper } from "@/modules/quizzes/components/RegisterRequiredWrapper";
import { QuizCarouselItem } from "@/modules/quizzes/quick-test/QuizCarouselItem";
import { QuizQuickTestResult } from "@/modules/quizzes/quick-test/QuizQuickTestResult";
import { QuizQuickTestTopBar } from "@/modules/quizzes/quick-test/QuizQuickTestTopBar";
import { getRequest } from "@/service/data";
import { useAppStore } from "@/store/useAppStore";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";

export function QuizQuickTest() {
  const isSmScreen = useMediaQuery("(max-width: 640px)");
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselCount, setCarouselCount] = useState(0);

  const { quizId } = useParams();
  const userId = useAppStore((state) => state.profile?.id);

  const [currentExplanation, setCurrentExplanation] = useState("");
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [carouselItemCorrectAnswers, setCarouselItemCorrectAnswers] = useState<
    Record<number, boolean>
  >({});
  const [showingCorrectAnsOfAllQuestions, setShowingCorrectAnsOfAllQuestions] =
    useState(false);
  const [quizRegisterPromptOpen, setQuizRegisterPromptOpen] = useState(false);
  const [
    shouldShowCorrectAnsAfterSelection,
    setShouldShowCorrectAnsAfterSelection,
  ] = useState(false);
  const [questions, setQuestions] = useState<TQuizQuestion[]>([]);

  const { data: quiz, isLoading } = useSWR<TQuiz>(
    userId && quizId ? `/v1/exams/${quizId}` : null,
    getRequest
  );

  const isMyQuiz = userId === quiz?.owner?.id;

  const correctAnswers = useMemo(
    () =>
      questions?.reduce((acc, question, i) => {
        if (question.correctAnswer === userAnswers[i]) {
          return acc + 1;
        }
        return acc;
      }, 0),
    [questions, userAnswers]
  );

  useEffect(() => {
    if (!isLoading && quiz) setQuestions(shuffleArray(quiz.questions));
  }, [isLoading, quiz]);

  useEffect(() => {
    if (!isLoading && !isMyQuiz && !quiz?.isLearning) {
      setQuizRegisterPromptOpen(true);
    }
  }, [isLoading, quiz?.isLearning, isMyQuiz]);

  useEffect(() => {
    if (!carouselApi) return;

    setCarouselCount(carouselApi.scrollSnapList().length);
    setCarouselIndex(carouselApi.selectedScrollSnap() + 1);

    carouselApi.on("select", () => {
      setCarouselIndex(carouselApi.selectedScrollSnap() + 1);
    });
  }, [carouselApi]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        carouselApi?.scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        carouselApi?.scrollNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [carouselApi]);

  const handleRetakeTest = () => {
    setCarouselItemCorrectAnswers({});
    setUserAnswers({});
    setQuestions(shuffleArray(quiz?.questions ?? []));
    setShowingCorrectAnsOfAllQuestions(false);
    carouselApi?.scrollTo(0, true);
  };

  const handleShowCorrectAns = () => {
    setShowingCorrectAnsOfAllQuestions(true);
    carouselApi?.scrollTo(0, true);
  };

  const handleShowExplanation = useCallback((explanation: string) => {
    setCurrentExplanation(explanation);
  }, []);

  const handleSelectAnswer = useCallback((index: number, ans: string) => {
    setUserAnswers((prev) => ({ ...prev, [index]: ans }));
  }, []);

  const handleShowItemCorrectAns = useCallback((index: number) => {
    setCarouselItemCorrectAnswers((prev) => ({
      ...prev,
      [index]: true,
    }));
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
            shouldShowCorrectAnsAfterSelection={
              shouldShowCorrectAnsAfterSelection
            }
            onShowCorrectAnsAfterSelection={
              setShouldShowCorrectAnsAfterSelection
            }
            carouselCount={carouselCount}
            carouselIndex={carouselIndex}
          />

          <Carousel setApi={setCarouselApi} className="w-full">
            <CarouselContent>
              {questions.map((item, index) => (
                <QuizCarouselItem
                  key={index}
                  index={index}
                  isActive={index === carouselIndex}
                  item={item}
                  shouldShowCorrectAnsAfterSelection={
                    shouldShowCorrectAnsAfterSelection
                  }
                  showingCorrectAnsOfAllQuestions={
                    showingCorrectAnsOfAllQuestions
                  }
                  userSelectedAns={userAnswers[index]}
                  showingItemCorrectAns={carouselItemCorrectAnswers[index]}
                  onShowingItemCorrectAns={handleShowItemCorrectAns}
                  onSelectAns={handleSelectAnswer}
                  onShowExplanation={handleShowExplanation}
                />
              ))}
              {!isLoading && quiz && (
                <QuizQuickTestResult
                  title={quiz.title}
                  level={quiz.jlptLevel}
                  quesLength={questions.length}
                  correctAnswers={correctAnswers}
                  onShowCorrectAns={handleShowCorrectAns}
                  onRetake={handleRetakeTest}
                />
              )}
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
