import { Card, CardContent } from "@/components/ui/card";
import { CarouselItem } from "@/components/ui/carousel";
import { cn } from "@/lib";
import { useEffect, useState } from "react";

export function FlashcardCarouselItem({
  item,
  showingMeaning,
}: {
  item: TFlashCardItem;
  showingMeaning: boolean;
}) {
  const [showingBackSide, setShowingBackSide] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        setShowingBackSide((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <CarouselItem>
      <Card
        onClick={() => {
          setShowingBackSide(!showingBackSide);
        }}
        className={cn(showingBackSide ? "flip-out" : "flip-in")}
      >
        <CardContent className="flex cursor-pointer aspect-square flex-col gap-3 sm:aspect-video items-center justify-center p-6">
          <span
            className={cn("text-xl sm:text-3xl font-semibold")}
            style={{ transform: showingBackSide ? "rotateX(180deg)" : "" }}
          >
            {showingBackSide ? item.frontSide : item.backSide}
          </span>
          {showingMeaning && (
            <span className="text-sm whitespace-pre sm:text-base">
              {item.frontSideComment}
            </span>
          )}
        </CardContent>
      </Card>
    </CarouselItem>
  );
}
