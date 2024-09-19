import { Card, CardContent } from "@/components/ui/card";
import { CarouselItem } from "@/components/ui/carousel";
import { useEffect, useState } from "react";

export function FlashcardItem({
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
    <CarouselItem onClick={() => setShowingBackSide(!showingBackSide)}>
      <Card>
        <CardContent className="flex aspect-square flex-col gap-3 sm:aspect-video items-center justify-center p-6">
          <span className="text-xl sm:text-3xl font-semibold">
            {showingBackSide ? item.backSide : item.frontSide}
          </span>
          {showingMeaning && (
            <span className="text-sm whitespace-pre sm:text-base">
              {showingBackSide ? item.backSideComment : item.frontSideComment}
            </span>
          )}
        </CardContent>
      </Card>
    </CarouselItem>
  );
}
