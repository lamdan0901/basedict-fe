"use client";

import { AdSense } from "@/components/Ad";
import { Button } from "@/components/ui/button";
import { useIsVipUser } from "@/hooks/useIsVipUser";
import { QuizItem } from "@/modules/quizzes/components/QuizItem";
import { UserQuizHeader } from "@/modules/quizzes/components/UserQuizHeader";
import { QUIZ_LIMIT } from "@/modules/quizzes/const";
import { quizRepo } from "@/lib/supabase/client";
import { useAppStore } from "@/store/useAppStore";
import { CircleHelp, Plus } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { shallow } from "zustand/shallow";

export function MyQuizzes() {
  const profile = useAppStore(
    (state) => ({
      id: state.profile?.id,
      avatar: state.profile?.avatar,
      name: state.profile?.name,
    }),
    shallow
  );
  const isVip = useIsVipUser();

  const { data: myQuiz, isLoading } = useSWR<TMyQuiz>(
    profile.id ? ["my-quizzes", profile.id] : null,
    () => quizRepo.getMyQuizzes(profile.id!)
  );

  const myExams = myQuiz?.myExams ?? [];
  const learningExams = myQuiz?.learningExams ?? [];
  const total = (myExams?.length ?? 0) + (learningExams?.length ?? 0);
  const totalLearnedNumber = myQuiz?.totalLearnedNumber ?? 0;
  const totalLearningNumber = myQuiz?.totalLearningNumber ?? 0;
  const limitReached = isVip ? false : total === QUIZ_LIMIT;

  return (
    <div>
      <div className="space-y-4">
        <UserQuizHeader
          avatar={profile?.avatar}
          name={profile?.name}
          totalSet={total}
          totalLearningNumber={totalLearningNumber}
          totalLearnedNumber={totalLearnedNumber}
        />

        <div className="flex justify-end gap-3 items-center">
          {!isVip && (
            <span>
              {total}/{QUIZ_LIMIT}
            </span>
          )}
          <Link
            className={limitReached ? "pointer-events-none" : ""}
            href="/quizzes/create"
          >
            <Button size={"sm"} disabled={limitReached}>
              <Plus className="size-5 mr-2" /> Tạo đề thi
            </Button>
          </Link>
        </div>

        <div>
          <div className="flex items-center mb-2 flex-wrap justify-between">
            <h2 className="text-lg font-semibold">Đề thi của tôi</h2>
            {!isVip && (
              <div className="flex text-muted-foreground items-center ">
                <i>Bạn chỉ có thể tạo và làm tối đa {QUIZ_LIMIT} đề</i>
                <CircleHelp className="size-5 ml-2" />
              </div>
            )}
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {isLoading ? (
              <span>Đang tải...</span>
            ) : !myExams.length ? (
              <span>Bạn chưa tạo đề thi nào</span>
            ) : null}
            {myExams.map((quiz) => (
              <QuizItem key={quiz.id} quiz={quiz} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg mb-2 pt-4 font-semibold">Đề thi đang làm</h2>
          <div className="grid gap-4 xl:grid-cols-2">
            {isLoading ? (
              <span>Đang tải...</span>
            ) : !learningExams.length ? (
              <span>Bạn chưa có đề thi nào đang làm</span>
            ) : null}
            {learningExams.map((quiz) => (
              <QuizItem key={quiz.id} quiz={quiz} />
            ))}
          </div>
        </div>
      </div>

      <AdSense slot="horizontal" />
    </div>
  );
}
