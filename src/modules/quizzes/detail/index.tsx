"use client";

import { AdSense } from "@/components/Ad";
import { LoginPrompt } from "@/components/AuthWrapper/LoginPrompt";
import { Markdown } from "@/components/Markdown";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { FLASHCARD_SETS_LIMIT_MSG } from "@/modules/flashcard/const";
import { QuizItem } from "@/modules/quizzes/components/QuizItem";
import { QuizRegisterPrompt } from "@/modules/quizzes/components/QuizRegisterPrompt";
import { deleteRequest, getRequest, postRequest } from "@/service/data";
import { useAppStore } from "@/store/useAppStore";
import { Check, CheckCheck } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";

export function QuizDetail() {
  const { toast } = useToast();
  const router = useRouter();
  const { quizId } = useParams();
  const userId = useAppStore((state) => state.profile?.id);

  const [alertOpen, setAlertOpen] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [quizRegisterPromptOpen, setQuizRegisterPromptOpen] = useState(false);
  const [isForbidden, setIsForbidden] = useState(false);

  const {
    data: quiz,
    isLoading,
    mutate: mutateFlashcardSet,
  } = useSWR<TQuiz>(`/v1/exams/${quizId}`, getRequest);

  const { trigger: startLearning, isMutating: isMutatingStartLearning } =
    useSWRMutation(`/v1/exams/${quizId}/start-learning`, postRequest);

  const { trigger: stopLearning, isMutating: isMutatingStopLearning } =
    useSWRMutation(`/v1/exams/${quizId}/stop-learning`, postRequest);

  const { trigger: deleteQuiz } = useSWRMutation(
    `/v1/exams/${quizId}`,
    deleteRequest
  );

  const isMyQuiz = userId === quiz?.owner?.id;
  const isTogglingLearning = isMutatingStartLearning || isMutatingStopLearning;
  const learningStatusTitle = quiz?.isLearning ? "Huỷ đăng kí" : "Đăng kí làm";

  async function toggleLearningStatus() {
    if (!userId) {
      setLoginPromptOpen(true);
      return;
    }

    try {
      await (quiz?.isLearning ? stopLearning() : startLearning());

      await Promise.all([mutate("/v1/exams/my-exams"), mutateFlashcardSet()]);
      toast({
        title: `${learningStatusTitle} thành công`,
        action: <Check className="h-5 w-5 text-green-500" />,
      });
    } catch (err) {
      toast({
        title:
          err === "FORBIDDEN"
            ? FLASHCARD_SETS_LIMIT_MSG
            : `${learningStatusTitle} không thành công, hãy thử lại!`,
        variant: "destructive",
      });
      console.log("err", err);
    }
  }

  async function handleDeleteQuiz() {
    try {
      await deleteQuiz();
      mutate("/v1/exams/my-exams");
      toast({
        title: `Xoá thành công`,
        action: <Check className="h-5 w-5 text-green-500" />,
      });
      router.push("/quizzes/my-quizzes");
    } catch (err) {
      console.log("err", err);
      toast({
        title: `Xoá không thành công, hãy thử lại!`,
        variant: "destructive",
      });
    }
  }

  function canGoToLearning() {
    if (!userId) {
      setLoginPromptOpen(true);
      return false;
    }
    if (!isMyQuiz && !quiz?.isLearning) {
      setQuizRegisterPromptOpen(true);
      return false;
    }
    return true;
  }

  function handleStartLearning() {
    if (!canGoToLearning()) return;

    router.push(`/quizzes/jlpt-test/${quizId}`);
  }

  function handleStartQuickTest() {
    if (!canGoToLearning()) return;

    router.push(`/quizzes/${quizId}/quick-test`);
  }

  async function handleRegisterQuiz() {
    try {
      await startLearning();

      setQuizRegisterPromptOpen(false);

      await Promise.all([mutate("/v1/exams/my-exams"), mutateFlashcardSet()]);

      router.push(`/quizzes/jlpt-test/${quizId}`);

      toast({
        title: `Đăng kí làm thành công`,
        action: <Check className="h-5 w-5 text-green-500" />,
      });
    } catch (err) {
      if (err === "FORBIDDEN") {
        setIsForbidden(true);
        return;
      }
      toast({
        title: `Đăng kí làm không thành công, hãy thử lại!`,
        variant: "destructive",
      });
      console.log("err", err);
    }
  }

  if (isLoading) return <div>Đang tải đề thi...</div>;
  if (!quiz) return <div>Không tìm thấy đề thi</div>;

  return (
    <div className="block md:flex h-full gap-6">
      <div className="space-y-6 w-full">
        <QuizItem quiz={quiz} asHeading />

        <div className="flex gap-2 pt-4 border-t border-muted-foreground flex-wrap justify-center">
          <Button disabled={isTogglingLearning} onClick={handleStartLearning}>
            Bắt đầu làm
          </Button>
          <Button disabled={isTogglingLearning} onClick={handleStartQuickTest}>
            Vào thi nhanh
          </Button>
          {!isMyQuiz && (
            <Button
              disabled={isTogglingLearning}
              onClick={toggleLearningStatus}
              variant={quiz.isLearning ? "destructive" : "secondary"}
            >
              {quiz.isLearning && <CheckCheck className="size-5 mr-2" />}
              {learningStatusTitle}
            </Button>
          )}
          {isMyQuiz && (
            <Link href={`/quizzes/update/${quizId}`}>
              <Button variant={"outline"}>Chỉnh sửa</Button>
            </Link>
          )}
          {isMyQuiz && (
            <Button onClick={() => setAlertOpen(true)} variant={"destructive"}>
              Xoá
            </Button>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-center mb-2">
            Danh sách câu hỏi
          </h2>
          <div className="space-y-4">
            {quiz.questions?.map((question, i) => {
              return (
                <Card key={question.id}>
                  <CardContent className="sm:p-4 p-2">
                    <Markdown markdown={`${i + 1}\\. ${question.question}`} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
        <AdSense slot="horizontal" />
      </div>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent aria-describedby="end-test">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bạn có muốn xoá đề <i>{quiz?.title}</i> này không?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter className="w-fit mx-auto">
            <AlertDialogAction onClick={handleDeleteQuiz}>
              Xoá
            </AlertDialogAction>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <LoginPrompt open={loginPromptOpen} onOpenChange={setLoginPromptOpen} />

      <QuizRegisterPrompt
        isForbidden={isForbidden}
        open={quizRegisterPromptOpen}
        onOpenChange={setQuizRegisterPromptOpen}
        onRegister={handleRegisterQuiz}
        disabled={isMutatingStartLearning}
      />
    </div>
  );
}
