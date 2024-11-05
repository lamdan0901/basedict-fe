import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  defaultQuizItem,
  questionTypes,
  QUIZ_ITEM_LIMIT,
} from "@/modules/quizzes/const";
import { TQuizForm, TQuizItem } from "@/modules/quizzes/schema";
import { ChevronRight, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
      <h2 className="text-lg mb-2 font-semibold">Tạo câu hỏi cho bộ đề</h2>

      <div className="space-y-6">
        {fields.map((item, i) => {
          return (
            <Card className="relative " key={item.uid}>
              <CardContent className="space-y-4">
                {item.id && (
                  <input type="hidden" {...register(`questions.${i}.id`)} />
                )}

                <FormField
                  control={control}
                  name={`questions.${i}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại câu hỏi</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {questionTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`questions.${i}.question`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Câu hỏi {i + 1}</FormLabel>
                      <Input
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.questions?.[i]?.question?.message}
                      />
                      <i className="text-muted-foreground text-xs">
                        Bạn hãy chọn đáp án đúng
                      </i>
                    </FormItem>
                  )}
                />

                <RadioGroup
                  // value={'c'}
                  // onValueChange={setSelectedSet}
                  className="space-y-4"
                >
                  {Array.from({ length: 4 }).map((_, quesIndex) => {
                    const name = `questions.${i}.answers.${quesIndex}` as const;
                    return (
                      <div
                        key={name}
                        className="flex items-center w-full gap-x-2"
                      >
                        <RadioGroupItem value={name} id={name} />
                        <label htmlFor={name}>bruh</label>
                        <FormField
                          control={control}
                          name={name}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Đáp án {quesIndex + 1}</FormLabel>
                              <Input
                                value={field.value}
                                onChange={field.onChange}
                                error={
                                  errors.questions?.[i]?.answers?.[quesIndex]
                                    ?.message
                                }
                              />
                            </FormItem>
                          )}
                        />
                      </div>
                    );
                  })}{" "}
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
                    className={"absolute z-10 top-0 right-2"}
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
          Lưu bộ đề
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
