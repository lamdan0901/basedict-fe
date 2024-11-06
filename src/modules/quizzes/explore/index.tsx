"use client";

import { AdSense } from "@/components/Ad";
import { BadgeList } from "@/components/BadgeList";
import { Input } from "@/components/ui/input";
import { QuizCreator } from "@/modules/quizzes/components/QuizCreator";
import { QuizItem } from "@/modules/quizzes/components/QuizItem";
import { getRequest } from "@/service/data";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";

export function QuizzesExplore() {
  const router = useRouter();

  const { data: quizTags, isLoading: isLoadingTags } = useSWR<TQuizTag[]>(
    "/v1/exams/tags",
    getRequest
  );

  const { data: quizDiscover, isLoading: isLoadingDiscover } = useSWR<{
    data: TQuiz[];
    total: number;
  }>("/v1/exams/discover", getRequest);

  const { data: topCreators = [], isLoading: isLoadingTopCreators } = useSWR<
    TQuizCreator[]
  >("/v1/exams/top-creator", getRequest);

  const quizzes = quizDiscover?.data ?? [];

  return (
    <div className="space-y-2">
      <div>
        <Link href="/quizzes/search">
          <Input type="text" placeholder="Tìm đề thi..." />
        </Link>
        <h2 className="text-lg mb-2 mt-4 font-semibold">Khám phá đề thi</h2>
        {isLoadingDiscover && "Đang tải..."}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <QuizItem key={quiz.id} hiddenDate quiz={quiz} />
          ))}
        </div>
        <Link
          className="text-blue-500 hover:underline block w-fit ml-auto mt-2"
          href="/quizzes/search"
        >
          Tìm kiếm thêm
        </Link>
      </div>

      <BadgeList
        isLoading={isLoadingTags}
        className="px-0 pb-4"
        titleClassName="font-semibold w-full"
        title="Các tag phổ biến"
        words={quizTags?.map((tag) => `${tag.name} (${tag.count})`)}
        onWordClick={(tag) => {
          tag = `q=~%28search~%27*23${tag.split("(")[0].trim()}%29`;
          router.push(`/quizzes/search?${tag}`);
        }}
      />

      <div>
        <h2 className="text-lg mb-2 font-semibold">Top người đóng góp</h2>
        {isLoadingTopCreators && "Đang tải..."}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topCreators.map((creator, i) => (
            <QuizCreator key={i} creator={creator} />
          ))}
        </div>
      </div>

      <AdSense slot="horizontal" />
    </div>
  );
}
