import { useLexemeStore } from "@/store/useLexemeStore";
import { Card, CardContent } from "@/components/ui/card";
import {
  MAX_PARAGRAPH_TRANS_TIMES,
  PARAGRAPH_TRANS_COUNT_KEY,
} from "@/modules/home/const";
import { CircleHelp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn, getCookie } from "@/lib";

export function TranslatedParagraph({
  isLoading,
  error,
}: {
  isLoading: boolean;
  error: string;
}) {
  const translatedParagraph = useLexemeStore(
    (state) => state.translatedParagraph
  );
  const useCount = Number(getCookie(PARAGRAPH_TRANS_COUNT_KEY) ?? 0);

  const shouldShowPlaceholder = !translatedParagraph || error === "FORBIDDEN";
  const shouldShowCounter =
    translatedParagraph?.usedCount || error === "FORBIDDEN";
  const shouldShowUsedUpMsg =
    (!translatedParagraph?.translated &&
      useCount === MAX_PARAGRAPH_TRANS_TIMES) ||
    error === "FORBIDDEN";

  return (
    <Card className="rounded-2xl  w-full  h-fit min-h-[328px] relative ">
      <CardContent id="translated-paragraph" className="!p-4 space-y-2">
        {isLoading ? (
          "Đang dịch..."
        ) : shouldShowPlaceholder ? null : error ? (
          <p className="text-destructive">Có lỗi xảy ra khi dịch đoạn văn</p>
        ) : (
          <div
            className="text-xl whitespace-pre-line"
            id="translated-paragraph"
          >
            {translatedParagraph.translated}
          </div>
        )}

        <div
          className={cn(
            "absolute top-1/2 -translate-x-4 w-full space-y-8 text-muted-foreground -translate-y-1/2 pointer-events-none"
          )}
        >
          <div
            className={cn(
              "space-y-2 text-center",
              shouldShowUsedUpMsg ? "block" : "hidden"
            )}
          >
            <span className="text-5xl sm:text-6xl font-semibold">(≥o≤)</span>
            <div className="text-destructive sm:text-xl px-2 text-lg">
              Bạn đã hết số lượt dịch miễn phí mỗi ngày
            </div>
          </div>
          <div
            className={cn(
              "sm:w-[80%] lg:w-[80%] w-[90%] md:w-[90%] mx-auto md:text-base text-sm",
              shouldShowPlaceholder ? "block" : "hidden"
            )}
          >
            - Mỗi ngày chỉ có thể dịch được tối đa 3 lần, reset vào 1:00 sáng
            mỗi ngày
            <br />- Bạn vẫn có thể dịch từng từ trong đoạn văn bằng cách quét
            chọn từ tương ứng và click "Dịch từ"
          </div>
        </div>
      </CardContent>

      <div className="absolute flex items-center text-sm right-2 -top-9 text-muted-foreground">
        {shouldShowCounter && (
          <span>
            {!shouldShowPlaceholder
              ? translatedParagraph?.usedCount
              : MAX_PARAGRAPH_TRANS_TIMES}
            /{MAX_PARAGRAPH_TRANS_TIMES}
          </span>
        )}
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                size={"icon"}
                variant={"ghost"}
                className="rounded-full size-8 !p-1"
              >
                <CircleHelp className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-[285px]">
                Mỗi ngày chỉ có thể dịch được tối đa 3 lần, reset vào 1:00 sáng
                mỗi ngày
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  );
}
