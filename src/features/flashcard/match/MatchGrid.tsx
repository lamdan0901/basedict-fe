import { Button } from "@/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type TMatchCard = {
  id: string;
  content: string;
  type: "front" | "back";
  isMatched: boolean;
  isHidden?: boolean;
};

type Props = {
  flashCards: TFlashCardItem[];
  toggleTimerRunning: (isRunning: boolean) => void;
  resetTimer: () => void;
};

export function MatchGrid({
  flashCards,
  toggleTimerRunning,
  resetTimer,
}: Props) {
  const [matchCards, setMatchCards] = useState<TMatchCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<TMatchCard[]>([]);
  const [shakeCards, setShakeCards] = useState<string[]>([]);
  const [allMatched, setAllMatched] = useState(false);

  const shuffleCards = useCallback(() => {
    const shuffledCards = flashCards
      .flatMap((card) => [
        {
          id: `${card.id}-front`,
          content: card.frontSide,
          type: "front" as const,
          isMatched: false,
        },
        {
          id: `${card.id}-back`,
          content: card.backSide,
          type: "back" as const,
          isMatched: false,
        },
      ])
      .sort(() => Math.random() - 0.5);

    setMatchCards(shuffledCards);
  }, [flashCards]);

  useEffect(() => {
    shuffleCards();
  }, [shuffleCards]);

  const hideMatchedCards = useCallback(
    (first: TMatchCard, second: TMatchCard) => {
      setTimeout(() => {
        setMatchCards((prev) => {
          const hiddenCards = prev.map((c) =>
            c.id === first.id || c.id === second.id
              ? { ...c, isMatched: true, isHidden: true }
              : c
          );

          const allCardsMatched = hiddenCards.every((card) => card.isMatched);
          if (allCardsMatched) {
            setTimeout(() => setAllMatched(true));
          }
          return hiddenCards;
        });
      }, 1000);
    },
    []
  );

  const handleCardMatched = useCallback(
    (first: TMatchCard, second: TMatchCard) => {
      setTimeout(() => {
        setMatchCards((prev) =>
          prev.map((c) =>
            c.id === first.id || c.id === second.id
              ? { ...c, isMatched: true }
              : c
          )
        );
        setSelectedCards([]);
        hideMatchedCards(first, second);
      }, 500);
    },
    [hideMatchedCards]
  );

  const handleCardNotMatched = useCallback(
    (first: TMatchCard, second: TMatchCard) => {
      setTimeout(() => {
        setShakeCards([first.id, second.id]);
        setTimeout(() => setShakeCards([]), 500);
        setSelectedCards([]);
      }, 500);
    },
    []
  );

  const handleCardClick = useCallback(
    (card: TMatchCard) => {
      if (card.isMatched || selectedCards.length === 2) return;

      const newSelectedCards = [...selectedCards, card];
      setSelectedCards(newSelectedCards);

      if (newSelectedCards.length === 2) {
        const [first, second] = newSelectedCards;
        const isMatched =
          first.id.split("-")[0] === second.id.split("-")[0] &&
          first.type !== second.type;

        isMatched
          ? handleCardMatched(first, second)
          : handleCardNotMatched(first, second);
      }
    },
    [handleCardMatched, handleCardNotMatched, selectedCards]
  );

  const resetGame = useCallback(() => {
    shuffleCards();
    setSelectedCards([]);
    setShakeCards([]);
    setAllMatched(false);
    toggleTimerRunning(true);
    resetTimer();
  }, [resetTimer, shuffleCards, toggleTimerRunning]);

  useEffect(() => {
    if (allMatched) {
      toggleTimerRunning(false);
    }
  }, [allMatched, toggleTimerRunning]);

  return (
    <div className="">
      {allMatched ? (
        <div className="mt-8 mx-auto w-fit">
          <Button onClick={resetGame}>
            <RotateCcw className="size-5 mr-2" /> Bắt đầu lại
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {matchCards.map((card) => (
            <div
              key={card.id}
              className={cn(
                "min-h-[150px] bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-all duration-300 transform",
                card.isMatched && "bg-green-100",
                card.isHidden && "opacity-0 pointer-events-none",
                selectedCards.includes(card) && "bg-blue-100",
                shakeCards.includes(card.id) && "bg-red-100 shake"
              )}
              onClick={() => handleCardClick(card)}
            >
              <div className="w-full h-full flex items-center justify-center p-2 text-center">
                {card.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
