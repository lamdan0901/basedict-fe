import { Markdown } from "@/components/Markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CarouselItem } from "@/components/ui/carousel";
import { cn } from "@/lib";
import DOMPurify from "dompurify";
import { memo, useEffect, useRef, useState } from "react";

type Props = {
  item: TQuizQuestion;
  showingCorrectAns: boolean;
  userSelectedAns: string;
  onShowExplanation: (explanation: string) => void;
  onSelectAns: (id: number, ans: string) => void;
};

export const QuizCarouselItem = memo<Props>(
  ({
    item,
    showingCorrectAns,
    userSelectedAns,
    onSelectAns,
    onShowExplanation,
  }) => {
    const carouselItemRef = useRef<HTMLDivElement>(null);
    const [showingItemCorrectAns, setShowingItemCorrectAns] = useState(false);

    useEffect(() => {
      const carouselEl = carouselItemRef.current;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.code === "Space") {
          event.preventDefault();
          if (!userSelectedAns) return;
          setShowingItemCorrectAns(true);
        }
      };
      carouselEl?.addEventListener("keydown", handleKeyDown);

      return () => {
        carouselEl?.removeEventListener("keydown", handleKeyDown);
      };
    }, [userSelectedAns]);

    function handleAnswerSelect(ans: string) {
      if (showingItemCorrectAns) return;
      onSelectAns(item.id, ans);
    }
    console.log("render", item.id);
    return (
      <CarouselItem ref={carouselItemRef}>
        <Card>
          <CardContent className="flex aspect-square flex-col gap-4 sm:aspect-video items-center justify-center p-6">
            <Markdown
              className="text-xl text-center sm:text-2xl font-semibold"
              markdown={item.question}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4">
              {item.answers.map((ans, i) => {
                const selectedAns = userSelectedAns === ans;
                const isCorrectAnswer =
                  showingItemCorrectAns && ans === item.correctAnswer;
                const isWrongAnswer =
                  showingItemCorrectAns && selectedAns && !isCorrectAnswer;
                return (
                  <Button
                    key={i}
                    variant={"outline"}
                    className={cn(
                      "min-h-[50px] h-fit bg-white rounded-lg shadow-md ",
                      selectedAns &&
                        "border bg-blue-100 border-muted-foreground",
                      isCorrectAnswer && "bg-green-100",
                      isWrongAnswer && "bg-red-100",
                      showingItemCorrectAns && "pointer-events-none"
                    )}
                    onClick={() => handleAnswerSelect(ans)}
                  >
                    <span
                      className="whitespace-pre-line"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(ans, {
                          USE_PROFILES: { html: true },
                        }),
                      }}
                    ></span>
                  </Button>
                );
              })}
            </div>

            <div className="flex gap-2 justify-center items-center flex-wrap">
              <Button
                disabled={showingItemCorrectAns || !userSelectedAns}
                onClick={() => setShowingItemCorrectAns(true)}
              >
                Xem đáp án
              </Button>
              <Button
                variant={"outline"}
                disabled={!item.explanation || !showingItemCorrectAns}
                onClick={() => onShowExplanation(item.explanation ?? "")}
              >
                {item.explanation ? "Xem giải thích" : "Không có giải thích"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </CarouselItem>
    );
  },
  (prev, next) => {
    return (
      prev.showingCorrectAns === next.showingCorrectAns &&
      prev.item.id === next.item.id &&
      prev.userSelectedAns === next.userSelectedAns
    );
  }
);
