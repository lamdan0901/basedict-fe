"use client";

import { getRequest } from "@/service/data";
import useSWR from "swr";
import { useAppStore } from "@/store/useAppStore";
import { useEffect } from "react";
import { JlptTestModule } from "@/modules/quizzes/JlptTestModule";

export function DailyTest() {
  const { profile, seasonRank } = useAppStore();

  const { data, isLoading, error } = useSWR<TJlptTestItem>(
    profile ? `/v1/exams/daily-exam?rank=${seasonRank}` : null,
    getRequest
  );

  useEffect(() => {
    document.title = `${seasonRank} - Daily exam | BaseDict`;
  }, [seasonRank]);

  if (!profile)
    return (
      <div className="text-xl text-destructive">
        Vui lòng đăng nhập để tiếp tục
      </div>
    );

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
