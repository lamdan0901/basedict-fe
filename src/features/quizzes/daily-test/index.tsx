"use client";

import { getRequest } from "@/shared/api/request";
import useSWR from "swr";
import { useAppStore } from "@/store/useAppStore";
import { useEffect } from "react";
import { JlptTestModule } from "@/features/quizzes/components/JlptTestModule";

export function DailyTest() {
  const { seasonRank } = useAppStore();

  const { data, isLoading, error } = useSWR<TQuiz>(
    `/v1/exams/daily-exam?rank=${seasonRank}`,
    getRequest
  );

  useEffect(() => {
    document.title = `${seasonRank} - Daily exam | BaseDict`;
  }, [seasonRank]);

  if (isLoading) return <div>Đang tải đề thi...</div>;
  if (!data && error)
    return <div>Đã xảy ra lỗi, hãy thử tải lại trang hoặc liên hệ hỗ trợ</div>;

  return (
    <JlptTestModule
      isDailyTest
      title={`${data?.title} - ${seasonRank}`}
      data={data}
    />
  );
}
