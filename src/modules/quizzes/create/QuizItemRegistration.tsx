import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { defaultQuizItem, QUIZ_ITEM_LIMIT } from "@/modules/quizzes/const";
import { TQuizForm, TQuizItem } from "@/modules/quizzes/schema";
import { Plus, Trash } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuid } from "uuid";

export function QuizItemRegistration({
  onSubmit,
  isMutating,
}: {
  onSubmit: () => void;
  isMutating: boolean;
}) {
  const router = useRouter();
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<TQuizForm>();

  const { fields, append, remove } = useFieldArray<{
    questions: TQuizItem[];
  }>({
    name: "questions",
  });
  const total = fields.length;
  const limitReached = total === QUIZ_ITEM_LIMIT;

  return (
    <div className="pt-2 space-y-4 border-t border-muted-foreground">
      <h2 className="text-lg mb-2 font-semibold">Tạo câu hỏi cho đề thi</h2>

      <div className="space-y-4">
        {fields.map((item, i) => {
          const correctAnswer = watch(`questions.${i}.correctAnswer`);
          return (
            <Card className="relative " key={item.uid}>
              <CardContent className="space-y-4">
                {item.id && (
                  <input type="hidden" {...register(`questions.${i}.id`)} />
                )}

                <FormField
                  control={control}
                  name={`questions.${i}.question`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Câu hỏi {i + 1}</FormLabel>
                      <Textarea
                        value={field.value}
                        onChange={field.onChange}
                        error={
                          errors.questions?.[i]?.question?.message ||
                          errors.questions?.[i]?.correctAnswer?.message
                        }
                      />
                      <i className="text-muted-foreground text-xs">
                        Bạn hãy chọn đáp án đúng
                      </i>
                    </FormItem>
                  )}
                />

                <RadioGroup
                  value={correctAnswer}
                  onValueChange={(val) =>
                    setValue(`questions.${i}.correctAnswer`, val)
                  }
                  className="space-y-2"
                >
                  {Array.from({ length: 4 }).map((_, ansIndex) => {
                    const name = `questions.${i}.answers.${ansIndex}` as const;
                    return (
                      <FormField
                        key={name}
                        control={control}
                        name={name}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="ml-7">
                              Đáp án {ansIndex + 1}
                            </FormLabel>
                            <div className="flex gap-x-2">
                              <RadioGroupItem
                                className="size-5 mt-3"
                                value={name}
                                id={name}
                              />
                              <Input
                                value={field.value}
                                onChange={field.onChange}
                                error={
                                  errors.questions?.[i]?.answers?.[ansIndex]
                                    ?.message
                                }
                              />
                            </div>
                          </FormItem>
                        )}
                      />
                    );
                  })}
                </RadioGroup>

                <FormField
                  control={control}
                  name={`questions.${i}.explanation`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giải thích đáp án</FormLabel>
                      <Textarea
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.questions?.[i]?.explanation?.message}
                      />
                    </FormItem>
                  )}
                />

                {total > 1 && (
                  <Button
                    type="button"
                    className={"absolute z-10 -top-3 right-1"}
                    size={"icon"}
                    variant={"ghost"}
                    title="Xoá câu hỏi này"
                    onClick={() => {
                      remove(i);
                    }}
                  >
                    <Trash className="text-destructive size-6" />
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center flex-wrap gap-3 items-center">
        <span>
          {total}/{QUIZ_ITEM_LIMIT}
        </span>
        <Button
          size={"sm"}
          type="button"
          variant={"outline"}
          disabled={isMutating}
          onClick={() => {
            if (limitReached) {
              toast({
                title: `Bạn chỉ có thể tạo tối đa ${QUIZ_ITEM_LIMIT} thẻ đề`,
                variant: "destructive",
              });
              return;
            }
            append(defaultQuizItem(uuid()));
          }}
        >
          <Plus className="size-5 mr-2" /> Thêm câu hỏi
        </Button>
        <Button disabled={isMutating} onClick={onSubmit} size={"sm"}>
          Lưu đề thi
        </Button>
        <Button
          variant={"destructive"}
          disabled={isMutating}
          onClick={() => router.back()}
          size={"sm"}
        >
          Hủy
        </Button>
      </div>

      <i className="text-muted-foreground w-fit mx-auto block text-xs">
        Bạn chỉ có thể tạo tối đa {QUIZ_ITEM_LIMIT} câu hỏi
      </i>
    </div>
  );
}
