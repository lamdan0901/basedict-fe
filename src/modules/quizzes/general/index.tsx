"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DEFAULT_AVATAR_URL } from "@/constants";
import { WeekdayCarousel } from "@/modules/quizzes/general/WeekdayCarousel";
import { getRequest } from "@/service/data";
import { useAppStore } from "@/store/useAppStore";
import Image from "next/image";
import { useState } from "react";
import useSWR from "swr";

export function QuizGeneralInfo() {
  const profile = useAppStore((state) => state.profile);
  const [currentSeason, setCurrentSeason] = useState("");

  // TODO: find a way to cache this data, refetch on every new day
  const { data: seasonList, isLoading: loadingSeasonList } = useSWR<TSeason[]>(
    "/v1/exams/season-list",
    getRequest,
    {
      onSuccess(data) {
        //TODO: từ ngày hiện tại tính ra season hiện tại dựa theo startDate vào endDate của season
        if (data.length > 0) {
          setCurrentSeason(data[0].name);
        }
      },
    }
  );
  const { data: seasonProfile, isLoading: loadingSeasonProfile } =
    useSWR<TSeasonProfile>(
      currentSeason ? `/v1/exams/profile?season=${currentSeason}` : null,
      getRequest
    );

  if (!profile)
    return (
      <div className="text-xl text-destructive">
        Vui lòng đăng nhập để tiếp tục
      </div>
    );

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

          <WeekdayCarousel />

          <div className="w-fit mx-auto mt-12">
            <p className="text-xl text-center mb-1 font-semibold">
              Rank {seasonProfile?.rank}
            </p>
            <div className="rounded-full text-white border-gray-700 border-[3px] flex flex-col items-center justify-center gap-2 bg-destructive size-40">
              <div className="text-xl">Điểm tích luỹ</div>
              <div className="text-2xl font-semibold">
                {seasonProfile?.rankPoint}/180
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
