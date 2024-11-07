import { CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  showingCorrectAns: boolean;
  onShowingCorrectAns: (checked: boolean) => void;
  currentCarouselIndex: number;
  count: number;
};

export function QuizQuickTestTopBar({
  showingCorrectAns,
  onShowingCorrectAns,
  currentCarouselIndex,
  count,
}: Props) {
  return (
    <div className="flex relative items-center justify-between">
      <div className="flex items-center space-x-2">
        <Switch
          checked={showingCorrectAns}
          onCheckedChange={onShowingCorrectAns}
          id="change-quick-test-mode"
        />
        <Label htmlFor="change-quick-test-mode">Hiện đáp án ngay</Label>
      </div>
      <div className="text-sm absolute left-1/2 -translate-x-1/2 top-7 sm:top-[unset] text-muted-foreground">
        {currentCarouselIndex} / {count}
      </div>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button size={"sm"} className="rounded-full" variant="ghost">
              <CircleHelp className="size-5 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs sm:max-w-sm">
              Các câu hỏi trong bộ đề sẽ được trộn ngẫu nhiên thứ tự mỗi lần bạn
              bắt đầu. <br />
              Sử dụng các nút trên màn hình để di chuyển giữa các thẻ: nút
              'Back' để quay lại câu hỏi trước trước và nút 'Next' để chuyển
              sang câu hỏi tiếp theo. <br />
              Nếu sử dụng bàn phím, bạn có thể ấn phím sang trái để quay lại thẻ
              trước, phím sang phải để chuyển sang câu hỏi tiếp theo, và phím
              dấu cách để xem đáp án. <br />
              Nếu bạn bật chế độ <i>Hiện đáp án ngay</i> thì ngay khi bạn chọn
              đáp án, bạn sẽ biết đáp án của bạn là đúng hay sai.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
