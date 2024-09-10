"use client";

import { getRequest } from "@/service/data";
import useSWR from "swr";
import { useAppStore } from "@/store/useAppStore";
import { useEffect } from "react";
import { JlptTestModule } from "@/modules/quizzes/JlptTestModule";
import { useAuthAlert } from "@/hooks/useAuthAlert";

export function DailyTest() {
  const { seasonRank } = useAppStore();
  const { user, authContent } = useAuthAlert();

  const { data, isLoading, error } = useSWR<TJlptTestItem>(
    user ? `/v1/exams/daily-exam?rank=${seasonRank}` : null,
    getRequest
  );

  useEffect(() => {
    document.title = `${seasonRank} - Daily exam | BaseDict`;
  }, [seasonRank]);

  if (authContent) return authContent;

  if (isLoading) return <div>Đang tải bài thi...</div>;
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
