"use client";

import { JlptTestModule } from "@/modules/quizzes/JlptTestModule";
import { getRequest } from "@/service/data";
import { useAppStore } from "@/store/useAppStore";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

export function BasedictTest() {
  const profile = useAppStore((state) => state.profile);
  const { level } = useParams();

  const { data, isLoading, error } = useSWR<TJlptTestItem>(
    level && profile ? `/v1/exams/basedict-exam?jlptLevel=${level}` : null,
    getRequest
  );

  useEffect(() => {
    document.title = `${level} - BaseDict | Đề thi JLPT biên soạn`;
  }, [level]);

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
      title={`Đề thi JLPT - ${level} <br/>(BaseDict biên soạn)`}
      data={data}
    />
  );
}
