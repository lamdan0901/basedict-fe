import { Button } from "@/components/ui/button";
import { ReadingQuestion } from "@/entities/reading-question";
import { useState } from "react";

export function ReadingQuestions({
  readingQuestions,
}: {
  readingQuestions?: TReadingQuestion[];
}) {
  const [resetKey, setResetKey] = useState(0);
  const [shouldShowAns, showAnswers] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

  function countCorrectAnswers() {
    return readingQuestions?.reduce((acc, question, index) => {
      if (question.correctAnswer === userAnswers[index]) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }

  return (
    <div className="">
      <h2 className="text-lg mb-3 font-semibold">Câu hỏi:</h2>
      {readingQuestions?.map((question, index) => (
        <ReadingQuestion
          key={index}
          index={""}
          selectionDisabled={shouldShowAns}
          shouldShowAns={shouldShowAns}
          questionText={`${index + 1}\\. ${question.question}`}
          radioGroupKey={`${index}-${resetKey}`}
          question={question}
          value={userAnswers[index]}
          onValueChange={(ans) => {
            if (shouldShowAns) return;
            setUserAnswers({
              ...userAnswers,
              [index]: ans,
            });
          }}
        />
      ))}

      <div className="flex gap-4 items-center">
        <Button
          variant={shouldShowAns ? "secondary" : "default"}
          onClick={() => {
            showAnswers(!shouldShowAns);
            if (shouldShowAns) {
              setUserAnswers({});
              setResetKey((prevKey) => prevKey + 1); // force the radio group to re-render after selection is reset
            }
          }}
        >
          {shouldShowAns ? "Ẩn đáp án" : "Xem đáp án"}
        </Button>
        {shouldShowAns && (
          <div>
            Bạn đúng {countCorrectAnswers()}/{readingQuestions?.length} câu hỏi
          </div>
        )}
      </div>
    </div>
  );
}
