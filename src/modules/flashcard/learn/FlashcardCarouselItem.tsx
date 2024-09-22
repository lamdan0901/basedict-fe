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
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        setIsFlipped((prev) => !prev);
        setIsFlipping(true);
        setTimeout(() => {
          setShowingBackSide((prev) => !prev);
          setIsFlipping(false);
        }, 350);
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
          setIsFlipped((prev) => !prev);
          setIsFlipping(true);
          setTimeout(() => {
            setShowingBackSide((prev) => !prev);
            setIsFlipping(false);
          }, 350);
        }}
        className={cn(isFlipped ? "flip-out" : "flip-in")}
      >
        <CardContent className="flex cursor-pointer aspect-square flex-col gap-3 sm:aspect-video items-center justify-center p-6">
          <span
            className={cn(
              "text-xl sm:text-3xl font-semibold",
              isFlipped ? "order-2" : "",
              isFlipping ? "opacity-0" : "opacity-1"
            )}
            style={{ transform: isFlipped ? "rotateX(180deg)" : "" }}
          >
            {isFlipping ? "" : showingBackSide ? item.frontSide : item.backSide}
          </span>
          {showingMeaning && (
            <span
              className={cn(
                "text-sm whitespace-pre-line sm:text-base",
                isFlipped ? "order-1" : ""
              )}
              style={{ transform: isFlipped ? "rotateX(180deg)" : "" }}
            >
              {isFlipping
                ? ""
                : showingBackSide
                ? item.frontSideComment
                : item.backSideComment}
            </span>
          )}
        </CardContent>
      </Card>
    </CarouselItem>
  );
}
