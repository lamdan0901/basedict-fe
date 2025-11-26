import { AdSense } from "@/components/Ad";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { flashcardRepo } from "@/lib/supabase/client";
import {
  defaultFlashcardSet,
  FLASHCARD_SETS_LIMIT_MSG,
} from "@/modules/flashcard/const";
import { FlashcardItemRegistration } from "@/modules/flashcard/create/FlashcardItemRegistration";
import { TagsSelect } from "@/modules/flashcard/create/TagsSelect";
import {
  flashCardSetSchema,
  TFlashCardSetForm,
} from "@/modules/flashcard/schema";
import { useAppStore } from "@/store/useAppStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { v4 as uuid } from "uuid";
import { FLASHCARD_KEYS } from "@/modules/flashcard/keys";

export function FlashcardCreation() {
  const { toast } = useToast();
  const router = useRouter();
  const { flashcardId } = useParams();
  console.log("🦆 flashcardId", flashcardId);

  const searchParams = useSearchParams();
  const userId = useAppStore((state) => state.profile?.id);

  const forwardedFlashcardParam = searchParams.get("defaultFlashcard");
  const defaultFlashcard = forwardedFlashcardParam
    ? JSON.parse(forwardedFlashcardParam)
    : null;

  const form = useForm<TFlashCardSetForm>({
    mode: "onSubmit",
    resolver: zodResolver(flashCardSetSchema),
    defaultValues: {
      ...defaultFlashcardSet,
      flashCards: defaultFlashcard ? [defaultFlashcard] : [],
    },
  });
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const { data: flashcardSet, isLoading: isLoadingFlashcardSet } =
    useSWR<TFlashcardSet>(
      flashcardId ? `flash-card-sets/${flashcardId}/get-one` : null,
      () => flashcardRepo.getFlashcardSetById(flashcardId as string)
    );
  const { trigger: addFlashcardSet, isMutating: isAddingFlashcardSet } =
    useSWRMutation(
      "createFlashcardSet",
      (_, { arg }: { arg: TFlashCardSetForm }) =>
        flashcardRepo.createFlashcardSet(arg, userId!)
    );
  const { trigger: updateFlashcardSet, isMutating: isUpdatingFlashcardSet } =
    useSWRMutation(
      `flash-card-sets/${flashcardId}/update`,
      (_, { arg }: { arg: TFlashCardSetForm }) =>
        flashcardRepo.updateFlashcardSet(Number(flashcardId), arg)
    );

  const isLoading = isLoadingFlashcardSet;
  const isMutating = isAddingFlashcardSet || isUpdatingFlashcardSet;
  const isMyFlashcard = userId === flashcardSet?.owner?.id;

  async function submitForm(data: TFlashCardSetForm) {
    try {
      data.flashCards.forEach((item) => {
        delete item.uid;
        if (item.id === "") delete item.id;
      });

      const { id } = await (flashcardId
        ? updateFlashcardSet(data)
        : addFlashcardSet(data));

      mutate(FLASHCARD_KEYS.myFlashcards(userId));
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
        tags:
          flashcardSet.tags?.map((tag) => ({ label: tag, value: uuid() })) ??
          [],
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
        <TagsSelect />
        <FlashcardItemRegistration
          isMutating={isMutating}
          onSubmit={handleSubmit(submitForm)}
        />
      </FormProvider>

      <AdSense slot="horizontal" />
    </div>
  );
}
