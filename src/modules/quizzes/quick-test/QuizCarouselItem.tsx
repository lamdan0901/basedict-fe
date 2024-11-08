import { Markdown } from "@/components/Markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CarouselItem } from "@/components/ui/carousel";
import { cn } from "@/lib";
import DOMPurify from "dompurify";
import { memo, useEffect } from "react";

type Props = {
  item: TQuizQuestion;
  index: number;
  isActive: boolean;
  shouldShowCorrectAnsAfterSelection: boolean;
  userSelectedAns: string;
  showingCorrectAnsOfAllQuestions: boolean;
  showingItemCorrectAns: boolean;
  onShowExplanation: (explanation: string) => void;
  onSelectAns: (id: number, ans: string) => void;
  onShowingItemCorrectAns: (id: number) => void;
};

export const QuizCarouselItem = memo<Props>(
  ({
    item,
    index,
    isActive,
    shouldShowCorrectAnsAfterSelection,
    showingCorrectAnsOfAllQuestions,
    showingItemCorrectAns,
    userSelectedAns,
    onSelectAns,
    onShowExplanation,
    onShowingItemCorrectAns,
  }) => {
    const _showingCorrectAns =
      showingItemCorrectAns || showingCorrectAnsOfAllQuestions;
    const canViewExplanation = item.explanation && _showingCorrectAns;
    const showCorrectAnsBtnDisabled =
      _showingCorrectAns ||
      !userSelectedAns ||
      shouldShowCorrectAnsAfterSelection;

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.code === "Space") {
          event.preventDefault();

          if (showCorrectAnsBtnDisabled || isActive) return;
          onShowingItemCorrectAns(index);
        }
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [isActive, index, onShowingItemCorrectAns, showCorrectAnsBtnDisabled]);

    function handleAnswerSelect(ans: string) {
      if (showingItemCorrectAns) return;

      onSelectAns(index, ans);
      if (shouldShowCorrectAnsAfterSelection) onShowingItemCorrectAns(index);
    }

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
                  _showingCorrectAns && ans === item.correctAnswer;
                const isWrongAnswer =
                  _showingCorrectAns && selectedAns && !isCorrectAnswer;
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
                      _showingCorrectAns && "pointer-events-none"
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
                disabled={showCorrectAnsBtnDisabled}
                onClick={() => onShowingItemCorrectAns(index)}
              >
                Xem đáp án
              </Button>
              <Button
                variant={"outline"}
                disabled={!canViewExplanation}
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
  (p, n) => {
    return (
      p.index === n.index &&
      p.item.id === n.item.id &&
      p.isActive === n.isActive &&
      p.userSelectedAns === n.userSelectedAns &&
      p.showingItemCorrectAns === n.showingItemCorrectAns &&
      p.showingCorrectAnsOfAllQuestions === n.showingCorrectAnsOfAllQuestions &&
      p.shouldShowCorrectAnsAfterSelection ===
        n.shouldShowCorrectAnsAfterSelection
    );
  }
);
