"use client";

import { Badge } from "@/components/ui/badge";
import { getRequest } from "@/service/data";
import { useAppStore } from "@/store/useAppStore";
import { useLexemeStore } from "@/store/useLexemeStore";
import useSWRImmutable from "swr/immutable";

export function TodaysTopic() {
  const jlptLevel = useAppStore.getState().profile?.jlptLevel ?? "N3";
  const { setText, setVocabMeaningErrMsg, setSelectedVocab, setWord } =
    useLexemeStore();
  const { data: todaysTopic, isLoading: loadingTodaysTopic } =
    useSWRImmutable<TReadingDetail>(
      `/v1/readings/daily-reading?jlptLevel=${jlptLevel}`,
      getRequest
    );

  function handleWordClick(word: string) {
    setText(word);
    setWord(word);
    setVocabMeaningErrMsg("");
    setSelectedVocab(null);

    const topEl = document.querySelector("#top");
    topEl?.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  return (
    <div className="flex flex-col items-center mt-4 justify-center">
      <div className="sm:w-4/5 w-full border-t mb-2 border-muted-foreground"></div>
      <div className="my-3">Chủ đề của ngày hôm nay</div>
      <h2 className="mb-3 text-2xl font-semibold">
        {loadingTodaysTopic ? "Đang tải..." : todaysTopic?.topic}
      </h2>

      <div className="flex sm:w-4/5 w-full sm:flex-row flex-col gap-6">
        <div className="flex-1 whitespace-pre-line">
          {todaysTopic?.japanese}
        </div>
        <div className="sm:w-px w-auto h-px sm:h-auto bg-muted-foreground"></div>
        <div className="flex-1 whitespace-pre-line">
          {todaysTopic?.vietnamese}
        </div>
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
