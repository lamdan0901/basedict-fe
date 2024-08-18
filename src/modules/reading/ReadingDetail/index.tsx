import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQueryParams } from "@/hooks/useQueryParam";
import { stringifyParams } from "@/lib";
import { readingTypes } from "@/modules/reading/const";
import { getRequest, postRequest } from "@/service/data";
import { useReadingStore } from "@/store/useReadingStore";
import { Check, SquareMenu } from "lucide-react";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";

export function ReadingDetail() {
  const { sheetOpen, setSheetOpen, selectedReadingItemId } = useReadingStore();
  const [answersShowed, toggleAnswers] = useState<Record<string, boolean>>({});
  const [readingParams] = useQueryParams({
    jlptLevel: "N1",
    readingType: 1,
  });

  const {
    data: readingItem,
    isLoading,
    mutate: updateReadingItem,
  } = useSWR<TReadingDetail>(
    selectedReadingItemId ? `/v1/readings/${selectedReadingItemId}` : null,
    getRequest,
    {
      onSuccess: (data) => {
        const initVal = data.readingQuestions.reduce((acc, question) => {
          acc[question.text] = false;
          return acc;
        }, {} as Record<string, boolean>);
        toggleAnswers(initVal);
      },
    }
  );
  const { trigger: markAsRead, isMutating: markingAsRead } = useSWRMutation(
    `/v1/readings/read/${selectedReadingItemId}`,
    postRequest
  );

  const readingTypeTitle = readingTypes.find(
    (type) => type.value === readingItem?.readingType
  )?.title;

  async function handleMarkAsRead() {
    await markAsRead();
    if (readingItem) updateReadingItem({ ...readingItem, isRead: true });
    mutate(`/v1/readings?${stringifyParams(readingParams)}`);
  }

  return (
    <div className="w-full mb-2">
      <div className="flex ml-4 items-center">
        <Button
          onClick={() => setSheetOpen(!sheetOpen)}
          variant={"ghost"}
          className="p-2 md:hidden"
        >
          <SquareMenu className="size-7" />
        </Button>
        <h1 className="text-3xl ml-2 font-bold">Luyện đọc theo cấp độ</h1>
      </div>

      <Card className="relative rounded-2xl mt-4">
        <CardContent className="py-4 min-h-[250px] space-y-4">
          {!selectedReadingItemId ? (
            "Chọn một bài đọc để bắt đầu"
          ) : isLoading ? (
            "Đang tải bài đọc..."
          ) : (
            <>
              <div className="flex w-full items-center justify-between">
                <h2 className="text-lg font-semibold">{readingItem?.title}</h2>
                <div className="flex items-center gap-2">
                  <div className="bg-slate-50 rounded-full px-2 text-sm border">
                    {readingTypeTitle}
                  </div>
                  <div className="bg-slate-50 rounded-full px-4 text-sm border">
                    {readingItem?.jlptLevel}
                  </div>
                </div>
              </div>

              <p>{readingItem?.content} </p>

              <div className="w-full h-px bg-muted-foreground"></div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Câu hỏi</h2>
                {readingItem?.readingQuestions.map((question, index) => (
                  <div key={index}>
                    <span>
                      {index + 1}. {question.text}{" "}
                    </span>
                    {answersShowed[question.text] ? (
                      <div>{question.answer}</div>
                    ) : (
                      <Button
                        variant={"link"}
                        onClick={() =>
                          toggleAnswers({
                            ...answersShowed,
                            [question.text]: true,
                          })
                        }
                        className="block h-fit p-0 text-blue-500"
                      >
                        Hiển thị đáp án
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {readingItem?.isRead ? (
                <div className="flex items-center absolute bottom-3 right-3 text-sm text-muted-foreground">
                  Đã đọc <Check className="w-4 h-4 ml-2" />
                </div>
              ) : (
                <Button
                  disabled={markingAsRead}
                  onClick={handleMarkAsRead}
                  variant={"link"}
                  className="text-blue-500 absolute bottom-0 right-3 p-0"
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
