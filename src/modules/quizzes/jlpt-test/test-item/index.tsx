"use client";

import { JlptTestModule } from "@/modules/quizzes/JlptTestModule";
import { getRequest } from "@/service/data";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

export function JLPTTest() {
  const { id } = useParams();

  const { data, isLoading, error } = useSWR<TJlptTestItem>(
    id ? `/v1/exams/${id}` : null,
    getRequest
  );

  useEffect(() => {
    if (data?.title)
      document.title = `${data?.title} - ${data?.jlptLevel} | BaseDict`;
  }, [data?.jlptLevel, data?.title]);

  if (isLoading) return <div>Đang tải bài thi...</div>;
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
    <JlptTestModule title={`${data?.title} - ${data?.jlptLevel}`} data={data} />
  );
}
