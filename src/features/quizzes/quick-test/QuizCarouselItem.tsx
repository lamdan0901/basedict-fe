import { Markdown } from "@/shared/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CarouselItem } from "@/components/ui/carousel";
import { cn } from "@/shared/lib";
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
    const showingCorrectAns =
      showingItemCorrectAns || showingCorrectAnsOfAllQuestions;

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.code === "Space") {
          event.preventDefault();

          if (showingCorrectAns || isActive) return;
          onShowingItemCorrectAns(index);
        }
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [isActive, index, onShowingItemCorrectAns, showingCorrectAns]);

    function handleAnswerSelect(ans: string) {
      // if (showingItemCorrectAns) return;

      onSelectAns(index, ans);

      if (shouldShowCorrectAnsAfterSelection && ans === item.correctAnswer) {
        onShowingItemCorrectAns(index);
      }
    }

    return (
      <CarouselItem>
        <Card>
          <CardContent className="grid lg:grid-rows-2 grid-rows-3  gap-4 xl:aspect-video p-6">
            <Markdown
              className="text-xl row-span-1 text-center self-end lg:self-center sm:text-2xl"
              markdown={item.question}
            />

            <div className="flex lg:row-span-1 row-span-2 flex-col gap-4 items-center justify-end">
              <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4">
                {item.answers.map((ans, i) => {
                  const selectedAns = userSelectedAns === ans;
                  const isCorrectAnswer =
                    (showingCorrectAns ||
                      (selectedAns && shouldShowCorrectAnsAfterSelection)) &&
                    ans === item.correctAnswer;
                  const isWrongAnswer =
                    (showingCorrectAns ||
                      (!!userSelectedAns &&
                        shouldShowCorrectAnsAfterSelection)) &&
                    selectedAns &&
                    !isCorrectAnswer;

                  return (
                    <Button
                      key={i}
                      variant={"outline"}
                      className={cn(
                        "min-h-[50px] h-fit bg-white  rounded-lg shadow-md ",
                        selectedAns &&
                          "border bg-blue-100 border-muted-foreground",
                        isCorrectAnswer && "hover:bg-green-100 bg-green-100",
                        isWrongAnswer && "hover:bg-red-100 bg-red-100"
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
                  size={"sm"}
                  disabled={showingCorrectAns}
                  onClick={() => onShowingItemCorrectAns(index)}
                >
                  Xem đáp án
                </Button>
                <Button
                  size={"sm"}
                  variant={"outline"}
                  disabled={!item.explanation}
                  onClick={() => onShowExplanation(item.explanation ?? "")}
                >
                  {item.explanation ? "Xem giải thích" : "Không có giải thích"}
                </Button>
              </div>
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
