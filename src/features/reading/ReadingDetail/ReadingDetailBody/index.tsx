import { Markdown } from "@/shared/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQueryParam, useQueryParams } from "@/shared/hooks/useQueryParam";
import { stringifyParams } from "@/shared/lib";
import { ReadingType, readingTypeMap } from "@/features/reading/const";
import { ReadingQuestions } from "@/features/reading/ReadingDetail/ReadingDetailBody/ReadingQuestions";
import { ReadingVocab } from "@/features/reading/ReadingDetail/ReadingDetailBody/ReadingVocab";
import { getRequest, postRequest } from "@/service/data";
import { Check } from "lucide-react";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";

export function ReadingDetailBody() {
  const [selectedReadingItemId] = useQueryParam<number | null>(
    "selectedReadingItemId",
    null
  );

  const [showVietnamese, setShowVietnamese] = useState(false);
  const [readingParams] = useQueryParams({
    jlptLevel: "N1",
    readingType: ReadingType.All,
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

  return (
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
              <Markdown markdown={readingItem?.japanese} />

              <Button
                onClick={() => setShowVietnamese(!showVietnamese)}
                variant={"link"}
                className="text-blue-500 h-fit block my-1 ml-auto p-0"
              >
                {showVietnamese ? "Ẩn bản dịch" : "  Xem bản dịch"}
              </Button>
              {showVietnamese && (
                <Markdown markdown={readingItem?.vietnamese} />
              )}
            </div>

            <div className="w-full h-px bg-muted-foreground"></div>

            <ReadingVocab lexemes={readingItem?.lexemes} />

            <ReadingQuestions
              readingQuestions={readingItem?.readingQuestions}
            />

            {readingItem?.isRead ? (
              <div className="flex items-center justify-end text-sm text-muted-foreground">
                Đã đọc <Check className="w-4 h-4 ml-2" />
              </div>
            ) : (
              <Button
                disabled={markingAsRead}
                onClick={handleMarkAsRead}
                variant={"link"}
                className="text-blue-500 block ml-auto z-10 p-0"
              >
                Đã đọc xong
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
