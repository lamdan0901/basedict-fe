"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DEFAULT_AVATAR_URL } from "@/constants";
import { WeekdayCarousel } from "@/modules/quizzes/general/WeekdayCarousel";
import { getRequest } from "@/service/data";
import { useAppStore } from "@/store/useAppStore";
import Image from "next/image";
import { useMemo, useState } from "react";
import useSWR from "swr";
import dayjs from "dayjs";
import { MAX_POINT } from "@/modules/quizzes/const";

export function QuizGeneralInfo() {
  const { profile, setSeasonRank } = useAppStore();
  const [currentSeason, setCurrentSeason] = useState<TSeason | undefined>();

  const { isLoading: loadingSeasonList } = useSWR<TSeason[]>(
    profile ? "/v1/exams/season-list" : null,
    getRequest,
    {
      onSuccess(data) {
        if (data.length > 0) {
          const currentDate = new Date().getTime();
          const currentSeason = data.find((season) => {
            return (
              currentDate >= new Date(season.startDate).getTime() &&
              currentDate <= new Date(season.endDate).getTime()
            );
          });
          setCurrentSeason(currentSeason);
        }
      },
    }
  );
  const { data: seasonProfile, isLoading: loadingSeasonProfile } =
    useSWR<TSeasonProfile>(
      currentSeason ? `/v1/exams/profile?season=${currentSeason.name}` : null,
      getRequest,
      {
        onSuccess(data) {
          setSeasonRank(data.rank);
        },
      }
    );
  const { data: seasonHistory = [], isLoading: loadingSeasonHistory } = useSWR<
    TSeasonHistory[]
  >(
    currentSeason
      ? `/v1/exams/season-history?season=${currentSeason.name}`
      : null,
    getRequest
  );
  const formattedSeasonHistory = useMemo(
    () =>
      seasonHistory.map((ex) => ({
        ...ex,
        createdAt: dayjs(ex.createdAt).format("YYYY-MM-DD"),
      })),
    [seasonHistory]
  );

  const passedDays = useMemo(
    () => dayjs(new Date()).diff(dayjs(currentSeason?.startDate), "day"),
    [currentSeason?.startDate]
  );

  const isLoading =
    loadingSeasonList || loadingSeasonProfile || loadingSeasonHistory;

  if (!profile)
    return (
      <div className="text-xl text-destructive">
        Vui lòng đăng nhập để tiếp tục
      </div>
    );

  if (isLoading) return <div>Đang tải thông tin chung...</div>;

  return (
    <Card>
      <CardContent className="space-y-8 pb-12 mt-4">
        <h2 className="font-semibold text-2xl mx-auto w-fit">
          Thông tin chung
        </h2>

        <div className="max-w-6xl mx-auto w-fit">
          <div className="flex gap-4">
            <Image
              width={80}
              height={80}
              className="rounded-full"
              src={profile?.avatar || DEFAULT_AVATAR_URL}
              alt="avatar"
            />
            <div>
              <div className="text-xl font-semibold">{profile?.name}</div>
              <div className="flex mt-2 gap-2">
                {seasonProfile?.badge.map((badge) => (
                  <Badge key={badge} variant={"secondary"} className="h-6">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <p className="text-gray-800 my-3 text-sm">
            {currentSeason?.name}:{" "}
            {new Date(currentSeason?.startDate ?? "").toLocaleDateString()} ~{" "}
            {new Date(currentSeason?.endDate ?? "").toLocaleDateString()}
          </p>

          <WeekdayCarousel
            rankPoint={seasonProfile?.rankPoint}
            currentSeason={currentSeason}
            seasonHistory={formattedSeasonHistory}
          />

          <p className="text-gray-800 w-fit mx-auto my-3 text-sm">
            Bạn đã hoàn thành {seasonHistory?.length}/{passedDays} bài thi daily
          </p>

          <div className="w-fit mx-auto mt-12">
            <p className="text-xl text-center mb-1 font-semibold">
              Rank {seasonProfile?.rank}
            </p>
            <div className="rounded-full text-white border-gray-700 border-[3px] flex flex-col items-center justify-center gap-2 bg-destructive size-40">
              <div className="text-xl">Điểm tích luỹ</div>
              <div className="text-2xl font-semibold">
                {seasonProfile?.rankPoint}/{MAX_POINT}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
