import { Markdown } from "@/components/Markdown";
import { Card, CardContent } from "@/components/ui/card";
import { CarouselItem } from "@/components/ui/carousel";
import { cn } from "@/lib";
import { memo, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";

type Props = {
  item: TQuizQuestion;
  showingCorrectAns: boolean;
  userSelectedAns: string;
  onShowExplanation: () => void;
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
    const [showingItemCorrectAns, setShowingItemCorrectAns] = useState(false);
    // const [selectedAns, setSelectedAns] = useState("");

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.code === "Space") {
          event.preventDefault();
          setShowingItemCorrectAns((prev) => !prev);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, []);

    function handleAnswerSelect(ans: string) {
      // setSelectedAns(ans);
      onSelectAns(item.id, ans);
    }
    console.log("render", item.id);
    return (
      <CarouselItem>
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
                      isWrongAnswer && "bg-red-100"
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
              <Button>Xem đáp án</Button>
              <Button
                variant={"outline"}
                disabled={!item.explanation}
                onClick={onShowExplanation}
              >
                {item.explanation ? "Xem giải thích" : "Không có giải thích"}
              </Button>
            </div>

            {(showingCorrectAns || showingItemCorrectAns) && (
              <span className={cn("text-sm whitespace-pre-line sm:text-base")}>
                {item.correctAnswer}
              </span>
            )}
          </CardContent>
        </Card>
      </CarouselItem>
    );
  },
  (prev, next) => {
    return (
      prev.showingCorrectAns === next.showingCorrectAns &&
        prev.item.id === next.item.id &&
        prev.userSelectedAns === next.userSelectedAns,
      prev.onSelectAns === next.onSelectAns &&
        prev.onShowExplanation === next.onShowExplanation
    );
  }
);
