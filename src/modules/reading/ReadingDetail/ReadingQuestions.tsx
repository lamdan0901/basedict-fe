import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib";

export function ReadingQuestions({
  readingQuestions,
}: {
  readingQuestions?: TReadingQuestion[];
}) {
  const [resetKey, setResetKey] = useState(0);
  const [answersShown, showAnswers] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

  function countCorrectAnswers() {
    let correctAnswers = 0;
    readingQuestions?.forEach((question, index) => {
      if (question.correctAnswer === userAnswers[index]) {
        correctAnswers++;
      }
    });
    return correctAnswers;
  }

  return (
    <div className="">
      <h2 className="text-lg mb-3 font-semibold">Câu hỏi:</h2>
      {readingQuestions?.map((question, index) => (
        <div className="space-y-3 mb-4" key={index}>
          <div>
            {index + 1}. {question.text}{" "}
          </div>
          <RadioGroup
            key={`${index}-${resetKey}`}
            value={userAnswers[index]}
            onValueChange={(ans) => {
              if (answersShown) return;
              setUserAnswers({ ...userAnswers, [index]: ans });
            }}
            className="space-y-3 ml-4"
          >
            {question.answers.map((answer) => {
              const isUserSelectedAns = userAnswers[index] === answer;
              const isCorrectAnswer = answer === question.correctAnswer;
              return (
                <div
                  key={answer}
                  className={cn(
                    "flex items-center space-x-2",
                    answersShown && isCorrectAnswer && "text-green-500",
                    answersShown &&
                      isUserSelectedAns &&
                      !isCorrectAnswer &&
                      "text-destructive"
                  )}
                >
                  <RadioGroupItem
                    className="text-inherit"
                    value={answer}
                    id={answer}
                  />
                  <Label className=" cursor-pointer" htmlFor={answer}>
                    {answer}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>
      ))}

      <div className="flex gap-4 items-center">
        <Button
          variant={answersShown ? "secondary" : "default"}
          onClick={() => {
            showAnswers(!answersShown);
            if (answersShown) {
              setUserAnswers({});
              setResetKey((prevKey) => prevKey + 1); // force the radio group to re-render after selection is reset
            }
          }}
        >
          {answersShown ? "Ẩn đáp án" : "Xem đáp án"}
        </Button>
        {answersShown && (
          <div>
            Bạn đúng {countCorrectAnswers()}/{readingQuestions?.length} câu hỏi
          </div>
        )}
      </div>
    </div>
  );
}
