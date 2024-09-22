import { CardIcon } from "@/components/icons";
import { SimilarLexemes } from "@/components/SimilarLexemes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib";
import { ChevronLeft, ChevronRight, CircleCheckBig, Heart } from "lucide-react";
import { memo, MouseEvent, useState } from "react";

type Props = {
  lexeme: TLexeme;
  isFavorite: boolean;
  onSimilarWordClick: (lexeme: string, e: MouseEvent<HTMLDivElement>) => void;
  onAddFlashcard({
    lexeme,
    currentMeaning,
  }: {
    lexeme: TLexeme;
    currentMeaning: TMeaning;
  }): void;
  onToggleFavorite(isFavorite: boolean): void;
};

export const VocabItem = memo<Props>(
  ({
    lexeme,
    isFavorite,
    onToggleFavorite,
    onSimilarWordClick,
    onAddFlashcard,
  }) => {
    console.log("lexeme", lexeme?.id);
    const [showExamples, setShowExamples] = useState(false);
    const [meaningIndex, setMeaningIndex] = useState(0);

    const currentMeaning = lexeme.meaning?.[meaningIndex];
    const meaningSize = lexeme.meaning?.length ?? 0;
    const canNext = meaningIndex < meaningSize - 1;
    const canPrev = meaningIndex > 0;

    return (
      <div className="relative space-y-2">
        <Card>
          <CardContent className="p-4 flex sm:flex-row flex-col items-center sm:gap-4">
            <div className={cn("flex flex-[2] flex-col")}>
              <span className="text-lg sm:text-xl font-semibold">
                {lexeme.standard}{" "}
                {lexeme.standard !== lexeme.lexeme ? `(${lexeme.lexeme})` : ""}
              </span>
              <span>{lexeme.hanviet}</span>
              <span>
                {lexeme.hiragana}{" "}
                {lexeme.hiragana2 ? `/ ${lexeme.hiragana2}` : ""}
              </span>
            </div>

            <div className="w-10">
              <ChevronRight className="size-10 text-muted-foreground shrink-0 sm:rotate-0 rotate-90" />
            </div>

            <div className="flex-[8]">
              {!currentMeaning ? (
                <span>Ý nghĩa của từ đang được cập nhật</span>
              ) : (
                <>
                  <div className="flex justify-between flex-wrap gap-2 mb-2">
                    <span className="sm:text-xl whitespace-pre-wrap font-semibold  text-lg">
                      {currentMeaning?.meaning}{" "}
                      {lexeme.approved && (
                        <CircleCheckBig className="text-green-500 shrink-0 w-4 h-4" />
                      )}
                    </span>
                    {meaningSize > 1 && (
                      <div className="flex gap-1">
                        <Button
                          size={"sm"}
                          disabled={!canPrev}
                          variant={"ghost"}
                          onClick={() => setMeaningIndex(meaningIndex - 1)}
                          className="p-1 text-muted-foreground h-fit rounded-full"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <Button
                          size={"sm"}
                          disabled={!canNext}
                          variant={"ghost"}
                          onClick={() => setMeaningIndex(meaningIndex + 1)}
                          className="p-1 text-muted-foreground h-fit rounded-full"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <p className="text-sm">{currentMeaning?.explaination}</p>

                  {currentMeaning?.example && (
                    <div>
                      <Button
                        onClick={() => setShowExamples((prev) => !prev)}
                        className="underline text-base px-0"
                        variant={"link"}
                      >
                        {showExamples ? "Ẩn" : "Xem"} ví dụ
                      </Button>
                      <p
                        className={cn(
                          "whitespace-pre-line",
                          showExamples ? "block" : "hidden"
                        )}
                      >
                        {currentMeaning?.example}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {currentMeaning && (
          <div className="absolute top-0 right-3 flex gap-2">
            <Button
              onClick={() => onAddFlashcard({ lexeme, currentMeaning })}
              className="rounded-full p-2"
              size="sm"
              variant="ghost"
              title="Thêm vào bộ flashcard"
            >
              <CardIcon />
            </Button>
            <Button
              onClick={() => onToggleFavorite(isFavorite)}
              className="rounded-full p-2"
              size="sm"
              variant="ghost"
              title="Thêm vào danh sách yêu thích"
            >
              <Heart
                className={cn(" w-5 h-5", isFavorite && "text-destructive")}
              />
            </Button>
          </div>
        )}

        {lexeme.similars.length > 0 && (
          <SimilarLexemes
            similars={lexeme.similars}
            onWordClick={onSimilarWordClick}
          />
        )}
      </div>
    );
  },
  (prev, next) => {
    return (
      prev.lexeme.id === next.lexeme.id && prev.isFavorite === next.isFavorite
    );
  }
);
