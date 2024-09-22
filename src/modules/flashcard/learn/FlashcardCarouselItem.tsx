import { Card, CardContent } from "@/components/ui/card";
import { CarouselItem } from "@/components/ui/carousel";
import { cn } from "@/lib";
import { DefaultFace } from "@/modules/flashcard/const";
import { useEffect, useState } from "react";

type Props = {
  item: TFlashCardItem;
  showingMeaning: boolean;
  defaultCardFace: DefaultFace;
};

export function FlashcardCarouselItem({
  item,
  showingMeaning,
  defaultCardFace,
}: Props) {
  const [showingBackSide, setShowingBackSide] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  function handleCardFlip(isBackFace?: boolean) {
    setIsFlipped(isBackFace ?? ((prev) => !prev));
    setIsFlipping(true);
    setTimeout(() => {
      setShowingBackSide(isBackFace ?? ((prev) => !prev));
      setIsFlipping(false);
    }, 350);
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        handleCardFlip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    handleCardFlip(defaultCardFace === DefaultFace.Back);
  }, [defaultCardFace]);

  return (
    <CarouselItem>
      <Card
        onClick={() => handleCardFlip()}
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
            {isFlipping ? "" : showingBackSide ? item.backSide : item.frontSide}
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
                ? item.backSideComment
                : item.frontSideComment}
            </span>
          )}
        </CardContent>
      </Card>
    </CarouselItem>
  );
}
