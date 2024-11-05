"use client";

import { AdSense } from "@/components/Ad";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { jlptLevels } from "@/constants";
import { defaultQuizFormValue, QUIZ_LIMIT_MSG } from "@/modules/quizzes/const";
import { QuizItemRegistration } from "@/modules/quizzes/create/QuizItemRegistration";
import { TagsSelect } from "@/modules/quizzes/create/TagsSelect";
import { quizSchema, TQuizForm } from "@/modules/quizzes/schema";
import { getRequest, patchRequest, postRequest } from "@/service/data";
import { useAppStore } from "@/store/useAppStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";

export function QuizCreation() {
  const { toast } = useToast();
  const router = useRouter();
  const { flashcardId } = useParams();
  const userId = useAppStore((state) => state.profile?.id);

  const form = useForm<TQuizForm>({
    mode: "onSubmit",
    resolver: zodResolver(quizSchema),
    defaultValues: defaultQuizFormValue,
  });
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const { data: quiz, isLoading: isLoadingQuiz } = useSWR<TFlashcardSet>(
    flashcardId ? `exams/${flashcardId}/get-one` : null,
    () => getRequest(`/v1/exams/${flashcardId}`)
  );
  const { trigger: addQuiz, isMutating: isAddingQuiz } = useSWRMutation(
    "/v1/exams",
    postRequest
  );
  const { trigger: updateQuiz, isMutating: isUpdatingQuiz } = useSWRMutation(
    `exams/${flashcardId}/update`,
    (_, { arg }: { arg: any }) =>
      patchRequest(`/v1/exams/${flashcardId}`, { arg })
  );

  const isLoading = isLoadingQuiz;
  const isMutating = isAddingQuiz || isUpdatingQuiz;
  const isMyQuiz = userId === quiz?.owner?.id;

  async function submitForm(data: TQuizForm) {
    try {
      data.questions.forEach((item) => {
        delete item.uid;
        if (item.id === "") delete item.id;
      });
      const formattedData = {
        ...data,
        tags: data.tags.map((tag) => tag.label.split("(")[0].trim()),
        questions: data.questions.map((question) => {
          // ex: questions.1.answers.1 -> index == 1
          const correctAnsIndex = Number(
            question.correctAnswer.split(".").at(-1)
          );
          return {
            ...question,
            correctAnswer: question.answers[correctAnsIndex],
          };
        }),
      };

      const { id } = await (flashcardId
        ? updateQuiz(formattedData)
        : addQuiz(formattedData));

      mutate("/v1/exams/my-exams");
      toast({
        title: `Lưu thành công`,
        action: <Check className="h-5 w-5 text-green-500" />,
      });
      router.push(`/flashcard/${id}`);
    } catch (err) {
      console.log("err", err);
      toast({
        title:
          err === "FORBIDDEN"
            ? QUIZ_LIMIT_MSG
            : `Lưu không thành công, hãy thử lại!`,
        variant: "destructive",
      });
    }
  }

  // useEffect(() => {
  //   if (flashcardSet)
  //     reset({
  //       ...flashcardSet,
  //       flashCards: flashcardSet.flashCards?.map((item) => ({
  //         ...item,
  //         uid: uuid(),
  //       })),
  //       tags:
  //         flashcardSet.tags?.map((tag) => ({ label: tag, value: uuid() })) ??
  //         [],
  //     });
  // }, [flashcardSet, reset]);

  if (isLoading) return <div>Đang tải bộ đề...</div>;
  if (flashcardId && !quiz) return <div>Không tìm thấy bộ đề</div>;
  if (flashcardId && !isMyQuiz)
    return <div>Bạn không có quyền chỉnh sửa bộ đề này</div>;

  return (
    <div className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="title">Tiêu đề</Label>
        <Input
          id="title"
          autoFocus
          {...register("title")}
          error={errors.title?.message}
          placeholder="Tiêu đề"
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          {...register("description")}
          error={errors.description?.message}
          placeholder="Mô tả"
        />
      </div>

      <FormProvider {...form}>
        <TagsSelect />

        <FormField
          control={form.control}
          name="jlptLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cấp độ</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-[135px]">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  {jlptLevels.map(({ title, value }) => (
                    <SelectItem key={value} value={value}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <QuizItemRegistration
          isMutating={isMutating}
          onSubmit={handleSubmit(submitForm)}
        />
      </FormProvider>

      <AdSense slot="horizontal" />
    </div>
  );
}
