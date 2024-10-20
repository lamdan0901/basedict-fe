import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib";
import {
  questionTypesWithExplanation,
  TestState,
} from "@/modules/quizzes/const";
import { useAnswerStore } from "@/store/useAnswerStore";
import { CircleHelp } from "lucide-react";
import { memo, useMemo, useState } from "react";
import useSWRMutation from "swr/mutation";
import { getRequest } from "../service/data";
import { Markdown } from "@/components/Markdown";

interface ReadingAnswerProps {
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

export const ReadingAnswer = memo<ReadingAnswerProps>(
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
    const [explanation, setExplanation] = useState("");
    const _value = useMemo(
      () => value ?? useAnswerStore.getState().userAnswers[+index.slice(1)],
      [index, value]
    );

    const { trigger, isMutating } = useSWRMutation(
      `/v1/question-masters/${question.id}/explanation`,
      (key) => getRequest(key)
    );

    async function handleGetExplanation() {
      try {
        const { explanation } = await trigger();
        setExplanation(explanation);
      } catch (err) {
        console.log("err: ", err);
      }
    }

    return (
      <div className="space-y-3 mb-4">
        <Markdown markdown={questionText} />
        <RadioGroup
          key={radioGroupKey}
          value={_value}
          onValueChange={onValueChange}
          className="space-y-3 ml-4"
        >
          {question.answers.map((answer) => {
            const isUserSelectedAns = _value === answer + index;
            const isCorrectAnswer = answer === question.correctAnswer;
            const shouldShowTooltip =
              shouldShowAns &&
              isCorrectAnswer &&
              question.type &&
              questionTypesWithExplanation.includes(question.type);

            return (
              <div
                key={answer + index}
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
                  value={answer + index}
                  disabled={selectionDisabled && testState !== TestState.Ready}
                  id={answer + index}
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
                <Label className="cursor-pointer" htmlFor={answer + index}>
                  <Markdown markdown={answer} />
                </Label>
                {shouldShowTooltip && (
                  <Popover>
                    <PopoverTrigger
                      onClick={() => handleGetExplanation()}
                      asChild
                    >
                      <div className="flex items-center cursor-pointer hover:underline text-muted-foreground gap-1">
                        <CircleHelp className={"size-4 "} />
                        <span className="text-xs italic">xem giải thích</span>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      className={cn(
                        "p-1",
                        !isMutating && "w-80 text-sm sm:w-[480px] lg:w-[768px]"
                      )}
                    >
                      <Markdown
                        markdown={
                          isMutating
                            ? "Đang tải giải thích..."
                            : question.explanation || explanation
                        }
                      />
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
