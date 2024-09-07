"use client";

import { JlptTestModule } from "@/modules/quizzes/JlptTestModule";
import { getRequest } from "@/service/data";
import { useAppStore } from "@/store/useAppStore";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

export function JLPTTest() {
  const profile = useAppStore((state) => state.profile);
  const { id } = useParams();

  const { data, isLoading, error } = useSWR<TJlptTestItem>(
    id && profile ? `/v1/exams/${id}` : null,
    getRequest
  );

  useEffect(() => {
    if (data?.title)
      document.title = `${data?.title} - ${data?.jlptLevel} | BaseDict`;
  }, [data?.jlptLevel, data?.title]);

  if (!profile)
    return (
      <div className="text-xl text-destructive">
        Vui lòng đăng nhập để tiếp tục
      </div>
    );

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
