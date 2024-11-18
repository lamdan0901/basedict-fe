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
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { v4 as uuid } from "uuid";

export function QuizCreation() {
  const { toast } = useToast();
  const router = useRouter();
  const { quizId } = useParams();
  const userId = useAppStore((state) => state.profile?.id);

  const form = useForm<TQuizForm>({
    mode: "onSubmit",
    resolver: zodResolver(quizSchema),
    defaultValues: defaultQuizFormValue,
  });
  const {
    reset,
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const { data: quiz, isLoading: isLoadingQuiz } = useSWR<TQuiz>(
    quizId ? `exams/${quizId}/get-one` : null,
    () => getRequest(`/v1/exams/${quizId}`)
  );
  const { trigger: addQuiz, isMutating: isAddingQuiz } = useSWRMutation(
    "/v1/exams",
    postRequest
  );
  const { trigger: updateQuiz, isMutating: isUpdatingQuiz } = useSWRMutation(
    `exams/${quizId}/update`,
    (_, { arg }: { arg: any }) => patchRequest(`/v1/exams/${quizId}`, { arg })
  );

  const isLoading = isLoadingQuiz;
  const isMutating = isAddingQuiz || isUpdatingQuiz;
  const isMyQuiz = userId === quiz?.owner?.id;

  async function submitForm(data: TQuizForm) {
    try {
      let hasCorrectAnsError = false;
      data.questions.forEach((question, index) => {
        if (!question.correctAnswer) {
          setError(`questions.${index}.correctAnswer`, {
            message: "Vui lòng chọn đáp án đúng cho câu hỏi này",
          });
          hasCorrectAnsError = true;
        }
      });
      if (hasCorrectAnsError) return;

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

      const { id } = await (quizId
        ? updateQuiz(formattedData)
        : addQuiz(formattedData));

      mutate("/v1/exams/my-exams");
      toast({
        title: `Lưu thành công`,
        action: <Check className="h-5 w-5 text-green-500" />,
      });
      router.push(`/quizzes/${id}`);
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

  useEffect(() => {
    if (!quiz) return;

    reset({
      ...quiz,
      questions: quiz.questions?.map((question, i) => {
        const correctAnsIndex = question.answers.findIndex(
          (answer) => answer === question.correctAnswer
        );
        return {
          ...question,
          correctAnswer: `questions.${i}.answers.${correctAnsIndex}`,
          uid: uuid(),
        };
      }),
      tags: quiz.tags?.map((tag) => ({ label: tag, value: uuid() })) ?? [],
    });
  }, [quiz, reset]);

  if (isLoading) return <div>Đang tải đề thi...</div>;
  if (quizId && !quiz) return <div>Không tìm thấy đề thi</div>;
  if (quizId && !isMyQuiz)
    return <div>Bạn không có quyền chỉnh sửa đề thi này</div>;

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
