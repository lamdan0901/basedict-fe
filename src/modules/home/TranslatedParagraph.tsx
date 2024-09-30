import { useLexemeStore } from "@/store/useLexemeStore";
import { Card, CardContent } from "@/components/ui/card";
import { MAX_PARAGRAPH_TRANS_TIMES } from "@/modules/home/const";
import { CircleHelp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib";

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
  const shouldShowPlaceholder = !translatedParagraph || error === "FORBIDDEN";
  const shouldShowCounter =
    translatedParagraph?.usedCount || error === "FORBIDDEN";

  return (
    <Card className="rounded-2xl  w-full  h-fit min-h-[328px] relative ">
      <CardContent id="translated-paragraph" className="!p-4 space-y-2">
        {isLoading ? (
          "Đang dịch..."
        ) : shouldShowPlaceholder ? null : error ? (
          <p className="text-destructive">Có lỗi xảy ra khi dịch đoạn văn</p>
        ) : (
          <div className="text-xl" id="translated-paragraph">
            {translatedParagraph.translated}
          </div>
        )}
        <p
          className={cn(
            "absolute top-1/2 left-5 w-[90%] sm:text-base text-sm text-muted-foreground -translate-y-1/2 pointer-events-none",
            shouldShowPlaceholder ? "block" : "hidden"
          )}
        >
          Lưu ý: <br />
          - Mỗi ngày chỉ có thể dịch được tối đa 3 lần, reset vào 1:00 sáng mỗi
          ngày
          <br />- Bạn vẫn có thể dịch từng từ trong đoạn văn bằng cách quét chọn
          từ tương ứng và click "Dịch từ"
        </p>
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
