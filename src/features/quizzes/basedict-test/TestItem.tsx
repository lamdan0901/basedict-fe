"use client";

import { JlptTestModule } from "@/features/quizzes/components/JlptTestModule";
import { getRequest } from "@/shared/api/request";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

export function BasedictTest() {
  const { level } = useParams();

  const { data, isLoading, error } = useSWR<TQuiz>(
    level ? `/v1/exams/basedict-exam?jlptLevel=${level}` : null,
    getRequest
  );

  useEffect(() => {
    document.title = `${level} - BaseDict | Đề thi JLPT biên soạn`;
  }, [level]);

  if (isLoading) return <div>Đang tải đề thi...</div>;
  if (!data && error)
    return <div>Đã xảy ra lỗi, hãy thử tải lại trang hoặc liên hệ hỗ trợ</div>;

  return (
    <JlptTestModule
      title={`Đề thi JLPT - ${level} <br/>(BaseDict biên soạn)`}
      data={data}
    />
  );
}
