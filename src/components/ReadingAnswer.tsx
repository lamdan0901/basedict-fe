import { Label } from "@/components/ui/label";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { cn } from "@/lib";

interface ReadingAnswerProps {
  question: TReadingQuestion;
  selectionDisabled: boolean;
  shouldShowAns: boolean;
  questionText: string;
  radioGroupKey: string;
  value: string | undefined;
  onValueChange?: (value: string) => void;
}

export function ReadingAnswer({
  question,
  selectionDisabled,
  shouldShowAns,
  questionText,
  radioGroupKey,
  value,
  onValueChange,
}: ReadingAnswerProps) {
  return (
    <div className="space-y-3 mb-4">
      <div
        className="whitespace-pre-line"
        dangerouslySetInnerHTML={{
          __html: questionText,
        }}
      ></div>
      <RadioGroup
        key={radioGroupKey}
        value={value}
        onValueChange={onValueChange}
        className="space-y-3 ml-4"
      >
        {question.answers.map((answer) => {
          const isUserSelectedAns = value === answer;
          const isCorrectAnswer = answer === question.correctAnswer;
          return (
            <div
              key={answer}
              className={cn(
                "flex items-center space-x-2",
                shouldShowAns && isCorrectAnswer && "text-green-500",
                shouldShowAns &&
                  isUserSelectedAns &&
                  !isCorrectAnswer &&
                  "text-destructive"
              )}
            >
              <RadioGroupItem
                className="text-inherit"
                value={answer}
                disabled={selectionDisabled}
                id={answer}
              />
              <Label
                dangerouslySetInnerHTML={{
                  __html: answer,
                }}
                className=" cursor-pointer"
                htmlFor={answer}
              ></Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}
