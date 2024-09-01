"use client";

import { Card, CardContent } from "@/components/ui/card";
import { JLPTTestDescModal } from "@/modules/quizzes/jlpt-test/JLPTTestDescModal";
import { JlptTestQuestions } from "@/modules/quizzes/jlpt-test/test-item/JlptTestQuestions";
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
    if (data?.title) document.title = `${data?.title} - ${data?.jlptLevel}`;
  }, [data?.jlptLevel, data?.title]);

  if (!profile)
    return (
      <div className="text-xl text-destructive">
        Vui lòng đăng nhập để tiếp tục
      </div>
    );

  if (isLoading) return <div>Đang tải bài thi...</div>;
  if (error)
    return <div>Đã xảy ra lỗi, hãy thử tải lại trang hoặc liên hệ hỗ trợ</div>;

  return (
    <Card>
      <CardContent>
        <h2 className="font-semibold text-2xl mt-4 mx-auto w-fit">
          {data?.title}
        </h2>
        <div className="w-fit ml-auto">
          <JLPTTestDescModal />
        </div>
        <JlptTestQuestions data={data} />
      </CardContent>
    </Card>
  );
}
