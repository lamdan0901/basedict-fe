"use client";

import { AdSense } from "@/components/Ad";
import { Button } from "@/components/ui/button";
import { useIsVipUser } from "@/hooks/useIsVipUser";
import { FLASHCARD_SETS_LIMIT } from "@/modules/flashcard/const";
import { QuizItem } from "@/modules/quizzes/components/QuizItem";
import { UserQuizHeader } from "@/modules/quizzes/components/UserFlashcardSetHeader";
import { QUIZ_LIMIT } from "@/modules/quizzes/const";
import { getRequest } from "@/service/data";
import { useAppStore } from "@/store/useAppStore";
import { CircleHelp, Plus } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { shallow } from "zustand/shallow";

export function MyQuizzes() {
  const profile = useAppStore(
    (state) => ({
      avatar: state.profile?.avatar,
      name: state.profile?.name,
    }),
    shallow
  );
  const isVip = useIsVipUser();

  const { data: myFlashcardSet, isLoading } = useSWR<TMyFlashcard>(
    `/v1/exams/my-exams`,
    getRequest
  );

  const myFlashCards = myFlashcardSet?.myFlashCards ?? [];
  const learningFlashCards = myFlashcardSet?.learningFlashCards ?? [];
  const total = (myFlashCards?.length ?? 0) + (learningFlashCards?.length ?? 0);
  const totalLearnedNumber = myFlashcardSet?.totalLearnedNumber ?? 0;
  const totalLearningNumber = myFlashcardSet?.totalLearningNumber ?? 0;
  const limitReached = isVip ? false : total === FLASHCARD_SETS_LIMIT;

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
              <Plus className="size-5 mr-2" /> Tạo bộ đề
            </Button>
          </Link>
        </div>

        <div>
          <div className="flex items-center mb-2 flex-wrap justify-between">
            <h2 className="text-lg font-semibold">Bộ đề của tôi</h2>
            {!isVip && (
              <div className="flex text-muted-foreground items-center ">
                <i>
                  Bạn chỉ có thể tạo và theo học tối đa {FLASHCARD_SETS_LIMIT}{" "}
                  bộ
                </i>
                <CircleHelp className="size-5 ml-2" />
              </div>
            )}
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {isLoading ? (
              <span>Đang tải...</span>
            ) : !myFlashCards.length ? (
              <span>Bạn chưa tạo bộ đề nào</span>
            ) : null}
            {myFlashCards.map((card) => (
              <QuizItem key={card.id} card={card} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg mb-2 pt-4 font-semibold">
            Flashcard đang theo học
          </h2>
          <div className="grid gap-4 xl:grid-cols-2">
            {isLoading ? (
              <span>Đang tải...</span>
            ) : !learningFlashCards.length ? (
              <span>Bạn chưa có bộ đề nào đang theo học</span>
            ) : null}
            {learningFlashCards.map((card) => (
              <QuizItem key={card.id} card={card} />
            ))}
          </div>
        </div>
      </div>

      <AdSense slot="horizontal" />
    </div>
  );
}
