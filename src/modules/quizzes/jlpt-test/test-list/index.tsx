"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LevelSelector } from "@/modules/quizzes/jlpt-test/test-list/LevelSelector";
import { JLPTTestDescLink } from "@/modules/quizzes/JLPTTestDescLink";
import { getRequest } from "@/service/data";
import { fetchUserProfile } from "@/service/user";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

export function JLPTTests() {
  const searchParams = useSearchParams();
  const _jlptLevel = searchParams.get("jlptLevel") as TJlptLevel;

  const { data: user, isLoading: isLoadingUser } = useSWR<TUser>(
    !_jlptLevel ? "get-user" : null,
    fetchUserProfile
  );
  const jlptLevel =
    _jlptLevel ?? (isLoadingUser ? undefined : user?.jlptLevel || "N3");

  const { data: jlptTests = [], isLoading: isLoadingJlptTests } = useSWR<
    TTestPeriod[]
  >(jlptLevel ? `/v1/exams/jlpt?jlptLevel=${jlptLevel}` : null, getRequest);

  const isLoading = isLoadingJlptTests || isLoadingUser;

  return (
    <Card>
      <CardContent className="space-y-6 mt-4">
        <h2 className="font-semibold text-2xl mx-auto w-fit">Làm đề JLPT</h2>

        <div className="flex items-end w-full justify-between">
          <LevelSelector jlptLevel={jlptLevel} /> <JLPTTestDescLink />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {isLoading
            ? "Đang tải đề thi JLPT..."
            : jlptTests.length === 0
            ? "Đề thi đang được cập nhật"
            : jlptTests.map((test) => (
                <Link href={`/quizzes/jlpt-test/${test.id}`} key={test.id}>
                  <Badge className="w-full h-12 text-base justify-center">
                    {test.title}
                  </Badge>
                </Link>
              ))}
        </div>
      </CardContent>
    </Card>
  );
}
