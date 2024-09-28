import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  defaultFlashcardSet,
  FLASHCARD_SETS_LIMIT_MSG,
} from "@/modules/flashcard/const";
import { FlashcardItemRegistration } from "@/modules/flashcard/create/FlashcardItemRegistration";
import {
  flashCardSetSchema,
  TFlashCardSetForm,
} from "@/modules/flashcard/schema";
import { getRequest, patchRequest, postRequest } from "@/service/data";
import { fetchUserProfile } from "@/service/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { v4 as uuid } from "uuid";

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
      flashcardId ? `flash-card-sets/${flashcardId}/get-one` : null,
      () => getRequest(`/v1/flash-card-sets/${flashcardId}`)
    );
  const { trigger: addFlashcardSet, isMutating: isAddingFlashcardSet } =
    useSWRMutation("/v1/flash-card-sets", postRequest);
  const { trigger: updateFlashcardSet, isMutating: isUpdatingFlashcardSet } =
    useSWRMutation(
      `flash-card-sets/${flashcardId}/delete`,
      (_, { arg }: { arg: TFlashCardSetForm }) =>
        patchRequest(`/v1/flash-card-sets/${flashcardId}`, { arg })
    );

  const isLoading = isLoadingFlashcardSet || isLoadingUser;
  const isMutating = isAddingFlashcardSet || isUpdatingFlashcardSet;
  const isMyFlashcard = user?.id === flashcardSet?.owner?.id;

  async function submitForm(data: TFlashCardSetForm) {
    try {
      data.flashCards.forEach((item) => {
        delete item.uid;
        if (item.id === "") delete item.id;
      });

      const { id } = await (flashcardId
        ? updateFlashcardSet(data)
        : addFlashcardSet(data));

      mutate("/v1/flash-card-sets/my-flash-card");
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
            ? FLASHCARD_SETS_LIMIT_MSG
            : `Lưu không thành công, hãy thử lại!`,
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    if (flashcardSet)
      reset({
        ...flashcardSet,
        flashCards: flashcardSet.flashCards?.map((item) => ({
          ...item,
          uid: uuid(),
        })),
      });
  }, [flashcardSet, reset]);

  if (isLoading) return <div>Đang tải bộ flashcard...</div>;
  if (flashcardId && !flashcardSet)
    return <div>Không tìm thấy bộ flashcard</div>;
  if (flashcardId && !isMyFlashcard)
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
        <Textarea
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
