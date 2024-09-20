import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FlashcardCarouselItem } from "@/modules/flashcard/learn/FlashcardCarouselItem";
import { getRequest } from "@/service/data";
import { CircleHelp } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

export function FlashcardLearning() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [showingMeaning, setShowingMeaning] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const { flashcardId } = useParams();
  const { data: flashcardSet, isLoading: isLoadingFlashcardSet } =
    useSWR<TFlashcardSet>(`/v1/flash-card-sets/${flashcardId}`, getRequest);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        api?.scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        api?.scrollNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [api]);

  if (isLoadingFlashcardSet) return <div>Đang tải bộ flashcard...</div>;
  if (!flashcardSet) return <div>Không tìm thấy bộ flashcard</div>;

  return (
    <div className="max-w-[285px] sm:max-w-lg md:max-w-xl xl:max-w-3xl ml-9 sm:ml-12 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            checked={showingMeaning}
            onCheckedChange={setShowingMeaning}
            id="airplane-mode"
          />
          <Label htmlFor="airplane-mode">Hiển thị giải nghĩa</Label>
        </div>
        <TooltipProvider>
          <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setShowTooltip(true)}
                size={"sm"}
                className="rounded-full"
                variant="ghost"
              >
                <CircleHelp className="size-5 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs sm:max-w-sm">
                Để sử dụng tính năng flashcard, bạn có thể ấn vào thẻ hoặc ấn
                phím dấu cách để lật giữa mặt trước và mặt sau.
                <br />
                Sử dụng các nút trên màn hình để di chuyển giữa các thẻ: nút
                'Back' để quay lại thẻ trước và nút 'Next' để chuyển sang thẻ
                tiếp theo.
                <br />
                Nếu sử dụng bàn phím, bạn có thể ấn phím sang trái để quay lại
                thẻ trước, phím sang phải để chuyển sang thẻ tiếp theo, và phím
                dấu cách để lật thẻ
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {flashcardSet.flashCards?.map((item, index) => (
            <FlashcardCarouselItem
              key={index}
              item={item}
              showingMeaning={showingMeaning}
            />
          ))}
        </CarouselContent>
        <CarouselPrevious
          className="sm:size-14 sm:-left-16"
          iconClassName="sm:size-8"
        />
        <CarouselNext
          className="sm:size-14 sm:-right-16"
          iconClassName="sm:size-8"
        />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        {current} / {count}
      </div>
    </div>
  );
}
