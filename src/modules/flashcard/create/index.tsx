import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { defaultFlashcardSet } from "@/modules/flashcard/const";
import { FlashcardItemRegistration } from "@/modules/flashcard/create/FlashcardItemRegistration";
import {
  flashCardSetSchema,
  TFlashCardSetForm,
} from "@/modules/flashcard/schema";
import { getRequest, patchRequest, postRequest } from "@/service/data";
import { fetchUserProfile } from "@/service/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { v4 as uuid } from "uuid";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Check } from "lucide-react";

export function FlashcardCreation() {
  const { toast } = useToast();
  const router = useRouter();
  const { flashcardId } = useParams();

  const form = useForm<TFlashCardSetForm>({
    mode: "onSubmit",
    resolver: zodResolver(flashCardSetSchema),
    defaultValues: defaultFlashcardSet,
  });
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const { data: user, isLoading: isLoadingUser } = useSWR<TUser>(
    flashcardId ? "get-user" : null,
    fetchUserProfile
  );
  const { data: flashcardSet, isLoading: isLoadingFlashcardSet } =
    useSWR<TFlashcardSet>(
      flashcardId ? `/v1/flash-card-sets/${flashcardId}` : null,
      getRequest,
      {
        onSuccess(data) {
          reset({
            ...data,
            flashCards: data.flashCards?.map((item) => ({
              ...item,
              uid: uuid(),
            })),
          });
        },
      }
    );
  const { trigger: addFlashcardSet, isMutating: isAddingFlashcardSet } =
    useSWRMutation("/v1/flash-card-sets", postRequest);
  const { trigger: updateFlashcardSet, isMutating: isUpdatingFlashcardSet } =
    useSWRMutation(`/v1/flash-card-sets/${flashcardId}`, patchRequest);

  const isLoading = isLoadingFlashcardSet || isLoadingUser;
  const isMutating = isAddingFlashcardSet || isUpdatingFlashcardSet;
  const isMyFlashcard = user?.id === flashcardSet?.owner?.id;

  async function submitForm(data: TFlashCardSetForm) {
    try {
      data.flashCards.forEach((item) => {
        delete item.uid;
      });
      await (flashcardId ? updateFlashcardSet(data) : addFlashcardSet(data));
      toast({
        title: `Lưu thành công`,
        action: <Check className="h-5 w-5 text-green-500" />,
      });
      router.push(`/flashcard/${flashcardId}`);
    } catch (err) {
      console.log("err", err);
      toast({
        title: `Lưu không thành công, hãy thử lại!`,
        variant: "destructive",
      });
    }
  }

  if (isLoading) return <div>Đang tải bộ flashcard...</div>;
  if (!flashcardSet) return <div>Không tìm thấy bộ flashcard</div>;
  if (!isMyFlashcard)
    return <div>Bạn không có quyền chỉnh sửa bộ flashcard này</div>;

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
        <Input
          id="description"
          {...register("description")}
          error={errors.description?.message}
          placeholder="Mô tả"
        />
      </div>
      <FormProvider {...form}>
        <FlashcardItemRegistration
          isMutating={isMutating}
          onSubmit={handleSubmit(submitForm)}
        />
      </FormProvider>
    </div>
  );
}
