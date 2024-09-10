"use client";

import { useAuthAlert } from "@/hooks/useAuthAlert";
import { JlptTestModule } from "@/modules/quizzes/JlptTestModule";
import { getRequest } from "@/service/data";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

export function BasedictTest() {
  const { level } = useParams();
  const { user, authContent } = useAuthAlert();

  const { data, isLoading, error } = useSWR<TJlptTestItem>(
    level && user ? `/v1/exams/basedict-exam?jlptLevel=${level}` : null,
    getRequest
  );

  useEffect(() => {
    document.title = `${level} - BaseDict | Đề thi JLPT biên soạn`;
  }, [level]);

  if (authContent) return authContent;

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
