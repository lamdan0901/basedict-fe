"use client";

import { RegisterRequiredWrapper } from "@/features/quizzes/components/RegisterRequiredWrapper";
import { JlptTestModule } from "@/features/quizzes/components/JlptTestModule";
import { getRequest } from "@/service/data";
import { useAppStore } from "@/store/useAppStore";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

export function JLPTTest() {
  const { id } = useParams();
  const isMixedTest = id === "mixed";
  const searchParams = useSearchParams();
  const userId = useAppStore((state) => state.profile?.id);

  const [flashcardRegisterPromptOpen, setFlashcardRegisterPromptOpen] =
    useState(false);

  const { data, isLoading, error } = useSWR<TQuiz>(
    id
      ? isMixedTest
        ? `v1/exams/jlpt/random?jlptLevel=${searchParams.get("jlptLevel")}`
        : `/v1/exams/${id}`
      : null,
    getRequest
  );

  const isMyFlashcard = userId === data?.owner?.id;

  useEffect(() => {
    if (data?.title)
      document.title = `${data?.title} - ${data?.jlptLevel} | BaseDict`;
  }, [data?.jlptLevel, data?.title]);

  useEffect(() => {
    if (isMixedTest) return;
    if (!isLoading && !isMyFlashcard && !data?.isLearning) {
      setFlashcardRegisterPromptOpen(true);
    }
  }, [isLoading, data?.isLearning, isMyFlashcard]);

  if (isLoading) return <div>Đang tải đề thi...</div>;
  if (!data && error)
    return (
      <div className="text-destructive">
        Đã xảy ra lỗi, hãy thử tải lại trang hoặc liên hệ hỗ trợ
      </div>
    );
  if (data?.questions.length === 0)
    return (
      <div>Đề thi đang được chúng tôi cập nhật, vui lòng quay lại sau</div>
    );

  return (
    <RegisterRequiredWrapper
      open={flashcardRegisterPromptOpen}
      onOpenChange={setFlashcardRegisterPromptOpen}
    >
      <JlptTestModule
        title={`${data?.title ?? "Đề trộn"} - ${data?.jlptLevel}`}
        data={data}
      />
    </RegisterRequiredWrapper>
  );
}
