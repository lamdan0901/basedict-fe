import { ShuffleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { shuffleArray } from "@/lib";
import { DefaultFace } from "@/modules/flashcard/const";
import { FlashcardCarouselItem } from "@/modules/flashcard/learn/FlashcardCarouselItem";
import { getRequest } from "@/service/data";
import { Check, CircleHelp } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

export function FlashcardLearning() {
  const { toast } = useToast();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [showingMeaning, setShowingMeaning] = useState(false);
  const [defaultCardFace, setDefaultCardFace] = useState(DefaultFace.Front);
  const [isShuffling, setIsShuffling] = useState(false);

  const { flashcardId } = useParams();
  const { data: flashcardSet, isLoading: isLoadingFlashcardSet } =
    useSWR<TFlashcardSet>(`/v1/flash-card-sets/${flashcardId}`, getRequest);

  const flashCards = useMemo(() => {
    const _flashcardSet = flashcardSet?.flashCards ?? [];
    return isShuffling ? shuffleArray(_flashcardSet) : _flashcardSet;
  }, [flashcardSet?.flashCards, isShuffling]);

  function handleShuffleCards() {
    setIsShuffling((prev) => !prev);

    if (!isShuffling) {
      toast({
        title: "Trộn flashcard thành công",
        action: <Check className="h-5 w-5 text-green-500" />,
      });
    }
  }

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
      <div className="flex relative items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            checked={showingMeaning}
            onCheckedChange={setShowingMeaning}
            id="airplane-mode"
          />
          <Label htmlFor="airplane-mode">Hiển thị giải nghĩa</Label>
        </div>
        <div className="text-sm absolute left-1/2 -translate-x-1/2 text-muted-foreground">
          {current} / {count}
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
          {flashCards.map((item, index) => (
            <FlashcardCarouselItem
              key={index}
              item={item}
              defaultCardFace={defaultCardFace}
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

      <div className="flex gap-2 justify-between items-center">
        <Select
          value={defaultCardFace}
          onValueChange={(val) => setDefaultCardFace(val as DefaultFace)}
        >
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={DefaultFace.Front}>
              {DefaultFace.Front}
            </SelectItem>
            <SelectItem value={DefaultFace.Back}>{DefaultFace.Back}</SelectItem>
          </SelectContent>
        </Select>
        <Button
          size={"icon"}
          onClick={handleShuffleCards}
          variant={isShuffling ? "default" : "outline"}
        >
          <ShuffleIcon />
        </Button>
      </div>
    </div>
  );
}
