"use client";

import { AdSense } from "@/components/Ad";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LevelSelector } from "@/modules/quizzes/jlpt-test/test-list/LevelSelector";
import { JLPTTestDescLink } from "@/modules/quizzes/components/JLPTTestDescLink";
import { quizRepo } from "@/lib/supabase/client";
import { useAppStore } from "@/store/useAppStore";
import { CheckCheck, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { shallow } from "zustand/shallow";

export function JLPTTests() {
  const searchParams = useSearchParams();
  const _jlptLevel = searchParams.get("jlptLevel") as TJlptLevel;

  const { profileJlptLevel, isLoading: isLoadingUser } = useAppStore(
    (state) => ({
      profileJlptLevel: state.profile?.jlptlevel,
      isLoading: state.isLoading,
    }),
    shallow
  );
  const jlptLevel =
    _jlptLevel ?? (isLoadingUser ? undefined : profileJlptLevel || "N3");

  const { data: jlptTests = [], isLoading } = useSWR<TTestPeriod[]>(
    jlptLevel ? `jlptTests-${jlptLevel}` : null,
    () => quizRepo.getJlptTests(jlptLevel!)
  );

  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={0}>
      <Card>
        <CardContent className="space-y-6 mt-4">
          <div className="flex flex-wrap items-end gap-2 w-full justify-between">
            <LevelSelector jlptLevel={jlptLevel} />
            <Link
              href={`/quizzes/jlpt-test/mixed?jlptLevel=${jlptLevel}`}
              className={isLoadingUser ? "pointer-events-none opacity-75" : ""}
            >
              <Badge
                variant={"destructive"}
                className="w-full h-12 text-base px-4 sm:px-8 justify-center"
              >
                Trộn câu hỏi JLPT
              </Badge>
            </Link>
            <JLPTTestDescLink />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {isLoading
              ? "Đang tải đề thi JLPT..."
              : jlptTests.length === 0
              ? "Đề thi đang được cập nhật"
              : jlptTests.map((test) => (
                  <Link href={`/quizzes/jlpt-test/${test.id}`} key={test.id}>
                    <Badge className="flex items-center w-full justify-center flex-col h-16">
                      <span className="text-base"> {test.title}</span>
                      <div className="flex font-normal gap-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex gap-1 items-center text-xs">
                              <GraduationCap className="size-5" />
                              <span>{test.learningNumber} người</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>Số người đang làm</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex gap-1 items-center text-xs">
                              <CheckCheck className="size-5" />
                              <span>{test.learnedNumber} lượt</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>Số người đã làm</TooltipContent>
                        </Tooltip>
                      </div>
                    </Badge>
                  </Link>
                ))}
          </div>
        </CardContent>

        <AdSense slot="horizontal" />
      </Card>
    </TooltipProvider>
  );
}
