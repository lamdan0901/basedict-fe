"use client";

import { MeaningPopup } from "@/widgets/translation/ui/popup";
import { Badge } from "@/components/ui/badge";
import { getRequest } from "@/service/data";
import { useAppStore } from "@/store/useAppStore";
import { MouseEvent, useRef, useState } from "react";
import useSWRImmutable from "swr/immutable";
import { shallow } from "zustand/shallow";

export function TodaysTopic() {
  const meaningPopupRef = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState("");
  const [showMeaningPopup, setShowMeaningPopup] = useState(false);
  const [popupTriggerPosition, setPopupTriggerPosition] = useState({
    top: 0,
    left: 0,
  });

  const { profileJlptLevel, isLoading } = useAppStore(
    (state) => ({
      profileJlptLevel: state.profile?.jlptLevel,
      isLoading: state.isLoading,
    }),
    shallow
  );
  const jlptLevel = isLoading ? undefined : profileJlptLevel || "N3";

  const { data: todaysTopic, isLoading: loadingTodaysTopic } =
    useSWRImmutable<TReadingDetail>(
      jlptLevel ? `/v1/readings/daily-reading?jlptLevel=${jlptLevel}` : null,
      getRequest
    );

  function handleWordClick(word: string, e: MouseEvent<HTMLDivElement>) {
    setShowMeaningPopup(true);
    setSelection(word);
    setPopupTriggerPosition({
      top: e.clientY,
      left: e.clientX,
    });
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

      {(todaysTopic?.lexemes?.length || 0) > 0 && (
        <div className="sm:w-2/3 lg:w-3/4 w-full sm:justify-center flex items-center gap-3 mt-3 flex-wrap">
          <span>Từ vựng ngày: </span>
          {todaysTopic?.lexemes?.map((word, i) => (
            <Badge
              className="cursor-pointer text-sm sm:text-base"
              onClick={(e) => handleWordClick(word, e)}
              key={i}
            >
              {word}
            </Badge>
          ))}
        </div>
      )}

      {showMeaningPopup && (
        <MeaningPopup
          ref={meaningPopupRef}
          selection={selection}
          popupTriggerPosition={popupTriggerPosition}
          showPopup={showMeaningPopup}
          setShowPopup={setShowMeaningPopup}
        />
      )}
    </div>
  );
}
