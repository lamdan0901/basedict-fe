import { Markdown } from "@/components/Markdown";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib";
import { TestState } from "@/modules/quizzes/const";
import { useAnswerStore } from "@/store/useAnswerStore";
import DOMPurify from "dompurify";
import { CircleHelp } from "lucide-react";
import { memo } from "react";

interface ReadingQuestionProps {
  question: TReadingQuestion;
  selectionDisabled: boolean;
  shouldShowAns: boolean;
  questionText: string;
  radioGroupKey: string;
  value?: string | undefined;
  onValueChange?: (value: string) => void;
  testState?: TestState;
  index: string;
}

export const ReadingQuestion = memo<ReadingQuestionProps>(
  ({
    question,
    selectionDisabled,
    shouldShowAns,
    questionText,
    testState,
    radioGroupKey,
    value,
    index,
    onValueChange,
  }) => {
    const setUserAnswers = useAnswerStore((state) => state.setUserAnswers);

    const handleAnswerChange = (answer: string) => {
      if (selectionDisabled) return;
      const questionIndex = +index.slice(1);
      setUserAnswers(questionIndex, answer);
    };

    return (
      <div className="space-y-3 mb-4">
        <Markdown markdown={questionText} />
        <RadioGroup
          key={radioGroupKey}
          value={value}
          onValueChange={onValueChange ?? handleAnswerChange}
          className="space-y-3 ml-4"
        >
          {question.answers.map((answer) => {
            const answerValue = answer + index;
            const isUserSelectedAns = value === answerValue;
            const isCorrectAnswer = answer === question.correctAnswer;
            const shouldShowTooltip =
              shouldShowAns && isCorrectAnswer && question.explanation;

            return (
              <div
                key={answerValue}
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
                  value={answerValue}
                  disabled={selectionDisabled && testState !== TestState.Ready}
                  id={answerValue}
                  onClick={(e) => {
                    if (selectionDisabled && testState === TestState.Ready) {
                      e.preventDefault();
                      toast({
                        title: 'Hãy chọn "Bắt đầu" để có thể làm bài thi',
                        variant: "destructive",
                      });
                    }
                  }}
                />
                <Label
                  className="cursor-pointer"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(answer, {
                      USE_PROFILES: { html: true },
                    }),
                  }}
                  htmlFor={answerValue}
                ></Label>
                {shouldShowTooltip && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="flex items-center cursor-pointer hover:underline text-muted-foreground gap-1">
                        <CircleHelp className={"size-4 "} />
                        <span className="text-xs italic">xem giải thích</span>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      className={cn(
                        "p-1",
                        "w-80 text-sm sm:w-[480px] lg:w-[768px]"
                      )}
                    >
                      <Markdown markdown={question.explanation} />
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            );
          })}
        </RadioGroup>
      </div>
    );
  }
);
