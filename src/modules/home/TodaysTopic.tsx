"use client";

import { Badge } from "@/components/ui/badge";
import { useUrlSearchParams } from "@/hooks/useUrlSearchParams";
import { getRequest } from "@/service/data";
import { useLexemeStore } from "@/store/useLexemeStore";
import useSWRImmutable from "swr/immutable";

const userLevel = "N3";

export function TodaysTopic() {
  const { setText, setSelectedVocab, setWord } = useLexemeStore();
  const setSearchParam = useUrlSearchParams();
  const { data: todaysTopic, isLoading: loadingTodaysTopic } =
    useSWRImmutable<TReadingDetail>(
      `/v1/readings/daily-reading?jlptLevel=${userLevel}`,
      getRequest
    );

  function handleWordClick(word: string) {
    setText(word);
    setSearchParam({ search: word });
    setSelectedVocab(null);
    setWord("");

    const topEl = document.querySelector("#top");
    topEl?.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  return (
    <div className="flex flex-col items-center mt-4 justify-center">
      <div className="sm:w-3/4 w-full border-t mb-2 border-muted-foreground"></div>
      <div className="my-3">Chủ đề của ngày hôm nay</div>
      <h2 className="mb-3 text-2xl font-semibold">
        {loadingTodaysTopic ? "Đang tải..." : todaysTopic?.topic}
      </h2>

      <div className="flex sm:flex-row flex-col gap-6">
        <div className="flex-1">{todaysTopic?.japanese}</div>
        <div className="sm:w-px w-auto h-px sm:h-auto bg-muted-foreground"></div>
        <div className="flex-1">{todaysTopic?.vietnamese}</div>
      </div>

      <div className="sm:w-2/3 lg:w-3/4 w-full sm:justify-center flex items-center gap-3 mt-3 flex-wrap">
        <span>Từ vựng ngày: </span>
        {todaysTopic?.lexemes?.map((word, i) => (
          <Badge
            className="cursor-pointer text-sm sm:text-base"
            onClick={() => handleWordClick(word)}
            key={i}
          >
            {word}
          </Badge>
        ))}
      </div>
    </div>
  );
}
