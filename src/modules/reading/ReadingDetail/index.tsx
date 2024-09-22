import { MeaningPopup } from "@/components/TranslationPopup/MeaningPopup";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQueryParams } from "@/hooks/useQueryParam";
import { stringifyParams } from "@/lib";
import { ReadingType, readingTypeMap } from "@/modules/reading/const";
import { ReadingQuestions } from "@/modules/reading/ReadingDetail/ReadingQuestions";
import { getRequest, postRequest } from "@/service/data";
import { useReadingStore } from "@/store/useReadingStore";
import { Check, SquareMenu } from "lucide-react";
import { MouseEvent, useRef, useState } from "react";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";

export function ReadingDetail() {
  const { sheetOpen, setSheetOpen, selectedReadingItemId } = useReadingStore();
  const [showVietnamese, setShowVietnamese] = useState(false);
  const [readingParams] = useQueryParams({
    jlptLevel: "N1",
    readingType: ReadingType.All,
  });
  const popupRef = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupTriggerPosition, setPopupTriggerPosition] = useState({
    top: 0,
    left: 0,
  });

  const {
    data: readingItem,
    isLoading,
    mutate: updateReadingItem,
    error,
  } = useSWR<TReadingDetail>(
    selectedReadingItemId ? `/v1/readings/${selectedReadingItemId}` : null,
    getRequest
  );
  const { trigger: markAsRead, isMutating: markingAsRead } = useSWRMutation(
    `/v1/readings/read/${selectedReadingItemId}`,
    postRequest
  );

  const readingTypeTitle = readingItem
    ? readingTypeMap[readingItem.readingType]
    : "";

  async function handleMarkAsRead() {
    await markAsRead();
    if (readingItem) updateReadingItem({ ...readingItem, isRead: true });
    mutate(`/v1/readings?${stringifyParams(readingParams)}`);
  }

  const handleSimilarWordClick =
    (lexeme: string) => (e: MouseEvent<HTMLDivElement>) => {
      setShowPopup(true);
      setSelection(lexeme);
      setPopupTriggerPosition({
        top: e.clientY,
        left: e.clientX,
      });
    };

  return (
    <div className="w-full mb-2">
      <div className="ml-4 ">
        <h1 className="sm:text-3xl text-2xl ml-2 font-bold">
          Luyện đọc theo cấp độ
        </h1>
        <Button
          onClick={() => setSheetOpen(!sheetOpen)}
          variant={"ghost"}
          className="p-2 gap-2 mt-1 text-primary md:hidden"
        >
          <SquareMenu className="size-6" />{" "}
          <span className="text-lg">Chọn bài đọc khác</span>
        </Button>
      </div>

      <Card className="relative rounded-2xl mt-3">
        <CardContent className="py-4 min-h-[250px] space-y-4">
          {!selectedReadingItemId ? (
            "Chọn một bài đọc để bắt đầu"
          ) : isLoading ? (
            "Đang tải bài đọc..."
          ) : error ? (
            "Có lỗi xảy ra, vui lòng thử lại"
          ) : (
            <>
              <div className="flex w-full flex-wrap gap-2 items-center justify-between">
                <h2 className="text-lg font-semibold">{readingItem?.title}</h2>
                <div className="flex items-center gap-2">
                  <div className="bg-slate-50 shrink-0 rounded-full px-2 text-sm border">
                    {readingTypeTitle}
                  </div>
                  <div className="bg-slate-50 shrink-0 rounded-full px-4 text-sm border">
                    {readingItem?.jlptLevel}
                  </div>
                </div>
              </div>

              <div className="relative mb-6 ">
                <p
                  className="whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: readingItem?.japanese ?? "",
                  }}
                ></p>
                <Button
                  onClick={() => setShowVietnamese(!showVietnamese)}
                  variant={"link"}
                  className="text-blue-500 h-fit block my-1 ml-auto p-0"
                >
                  {showVietnamese ? "Ẩn bản dịch" : "  Xem bản dịch"}
                </Button>
                {showVietnamese && (
                  <p
                    className="mb-2 whitespace-pre-line"
                    dangerouslySetInnerHTML={{
                      __html: readingItem?.vietnamese ?? "",
                    }}
                  ></p>
                )}
              </div>

              <div className="w-full h-px bg-muted-foreground"></div>

              <div className="flex flex-wrap gap-2">
                <h2 className="text-lg font-semibold">Từ vựng: </h2>
                {readingItem?.lexemes?.map((lexeme, i) => (
                  <Badge
                    className="cursor-pointer text-sm sm:text-base"
                    onClick={handleSimilarWordClick(lexeme)}
                    key={i}
                  >
                    {lexeme}
                  </Badge>
                ))}
              </div>
              {showPopup && (
                <MeaningPopup
                  ref={popupRef}
                  selection={selection}
                  popupTriggerPosition={popupTriggerPosition}
                  showPopup={showPopup}
                  setShowPopup={setShowPopup}
                />
              )}

              <ReadingQuestions
                readingQuestions={readingItem?.readingQuestions}
              />

              {readingItem?.isRead ? (
                <div className="flex items-center absolute bottom-3 right-3 text-sm text-muted-foreground">
                  Đã đọc <Check className="w-4 h-4 ml-2" />
                </div>
              ) : (
                <Button
                  disabled={markingAsRead}
                  onClick={handleMarkAsRead}
                  variant={"link"}
                  className="text-blue-500 absolute bottom-0 right-5 p-0"
                >
                  Đã đọc xong
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
