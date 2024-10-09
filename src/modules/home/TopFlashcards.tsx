import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FlashcardItem } from "@/modules/flashcard/components/FlashcardItem";
import { getRequest } from "@/service/data";
import useSWR from "swr";

export function TopFlashcardSets() {
  const { data: flashcardDiscover, isLoading: isLoadingDiscover } = useSWR<{
    data: TFlashcardSet[];
  }>("/v1/flash-card-sets/discover", getRequest);

  const flashcards = flashcardDiscover?.data?.slice(0, 6) ?? [];

  return (
    <div className="flex flex-col items-center mt-4 md:pb-0 pb-8 justify-center">
      <div className="sm:w-4/5 w-full border-t mb-2 border-muted-foreground"></div>
      <div className="my-3">Top 6 bộ flashcard phổ biến</div>
      {isLoadingDiscover && <div>Đang tải...</div>}

      <Carousel className="sm:w-4/5 w-full">
        <CarouselContent>
          {flashcards.map((item, index) => (
            <CarouselItem
              key={index}
              className="md:my-3 md:mx-0 md:basis-1/2 lg:basis-1/3"
            >
              <FlashcardItem className="h-full" card={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="top-[unset] -bottom-14 left-1/3" />
        <CarouselNext className="top-[unset] -bottom-14 right-1/3" />
      </Carousel>
    </div>
  );
}
