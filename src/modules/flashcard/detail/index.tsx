"use client";

import { AdSense } from "@/components/Ad/Ad";
import { LoginPrompt } from "@/components/AuthWrapper/LoginPrompt";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { FlashcardItem } from "@/modules/flashcard/components/FlashcardItem";
import { FlashcardSetRegisterPrompt } from "@/modules/flashcard/components/FlashcardSetRegisterPrompt";
import { FLASHCARD_SETS_LIMIT_MSG } from "@/modules/flashcard/const";
import { deleteRequest, postRequest } from "@/service/data";
import { fetchUserProfile } from "@/service/user";
import { Check, CheckCheck, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";

export function FlashcardDetail({
  flashcardSet,
}: {
  flashcardSet: TFlashcardSet | null | undefined;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const { flashcardId } = useParams();
  const [alertOpen, setAlertOpen] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [flashcardRegisterPromptOpen, setFlashcardRegisterPromptOpen] =
    useState(false);
  const [isForbidden, setIsForbidden] = useState(false);

  const { data: user, isLoading: isLoadingUser } = useSWR<TUser>(
    "get-user",
    fetchUserProfile
  );
  const { trigger: startLearning, isMutating: isMutatingStartLearning } =
    useSWRMutation(
      `/v1/flash-card-sets/${flashcardId}/start-learning`,
      postRequest
    );
  const { trigger: stopLearning, isMutating: isMutatingStopLearning } =
    useSWRMutation(
      `/v1/flash-card-sets/${flashcardId}/stop-learning`,
      postRequest
    );
  const { trigger: deleteFlashcardSet } = useSWRMutation(
    `/v1/flash-card-sets/${flashcardId}`,
    deleteRequest
  );

  const isMyFlashcard = user?.id === flashcardSet?.owner?.id;
  const isTogglingLearning = isMutatingStartLearning || isMutatingStopLearning;
  const isLoading = isLoadingUser;
  const learningStatusTitle = flashcardSet?.isLearning
    ? "Huỷ đăng kí"
    : "Đăng kí học";

  async function toggleLearningStatus() {
    if (!user?.id) {
      setLoginPromptOpen(true);
      return;
    }

    try {
      await (flashcardSet?.isLearning ? stopLearning() : startLearning());

      await mutate("/v1/flash-card-sets/my-flash-card");
      router.refresh();
      toast({
        title: `${learningStatusTitle} thành công`,
        action: <Check className="h-5 w-5 text-green-500" />,
      });
    } catch (err) {
      toast({
        title:
          err === "FORBIDDEN"
            ? FLASHCARD_SETS_LIMIT_MSG
            : `${learningStatusTitle} không thành công, hãy thử lại!`,
        variant: "destructive",
      });
      console.log("err", err);
    }
  }

  async function handleDeleteFlashcardSet() {
    try {
      await deleteFlashcardSet();
      mutate("/v1/flash-card-sets/my-flash-card");
      toast({
        title: `Xoá thành công`,
        action: <Check className="h-5 w-5 text-green-500" />,
      });
      router.push("/flashcard/my-flashcard");
    } catch (err) {
      console.log("err", err);
      toast({
        title: `Xoá không thành công, hãy thử lại!`,
        variant: "destructive",
      });
    }
  }

  function handleStartLearning() {
    if (!user?.id) {
      setLoginPromptOpen(true);
      return;
    }
    if (!isMyFlashcard && !flashcardSet?.isLearning) {
      setFlashcardRegisterPromptOpen(true);
      return;
    }

    router.push(`/flashcard/${flashcardId}/learn`);
  }

  async function handleRegisterFlashcardSet() {
    try {
      await startLearning();

      setFlashcardRegisterPromptOpen(false);
      mutate("/v1/flash-card-sets/my-flash-card");
      router.push(`/flashcard/${flashcardId}/learn`);

      toast({
        title: `Đăng kí học thành công`,
        action: <Check className="h-5 w-5 text-green-500" />,
      });
    } catch (err) {
      if (err === "FORBIDDEN") {
        setIsForbidden(true);
        return;
      }
      toast({
        title: `Đăng kí học không thành công, hãy thử lại!`,
        variant: "destructive",
      });
      console.log("err", err);
    }
  }

  if (isLoading) return <div>Đang tải bộ flashcard...</div>;
  if (!flashcardSet) return <div>Không tìm thấy bộ flashcard</div>;

  return (
    <div className="block md:flex h-full gap-6">
      <div className="space-y-6 w-full">
        <FlashcardItem
          card={flashcardSet}
          flashCardNumber={flashcardSet.flashCards?.length}
          asHeading
        />

        <div className="flex gap-2 pt-4 border-t border-muted-foreground justify-center">
          <Button onClick={handleStartLearning}>Bắt đầu học</Button>
          {!isMyFlashcard && (
            <Button
              disabled={isTogglingLearning}
              onClick={toggleLearningStatus}
              variant={flashcardSet.isLearning ? "destructive" : "secondary"}
            >
              {flashcardSet.isLearning && (
                <CheckCheck className="size-5 mr-2" />
              )}
              {learningStatusTitle}
            </Button>
          )}
          {isMyFlashcard && (
            <Link href={`/flashcard/update/${flashcardId}`}>
              <Button variant={"outline"}>Chỉnh sửa</Button>
            </Link>
          )}
          {isMyFlashcard && (
            <Button onClick={() => setAlertOpen(true)} variant={"destructive"}>
              Xoá
            </Button>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-center mb-2">
            Danh sách thẻ
          </h2>
          <div className="space-y-4">
            {flashcardSet.flashCards?.map((card) => {
              return (
                <Card key={card.id}>
                  <CardContent className="sm:p-4 p-2 items-center relative flex flex-col sm:flex-row gap-2">
                    <div className="sm:flex-[3] pr-7 w-full sm:pr-0 space-y-2">
                      <div className="font-semibold">{card.frontSide}</div>
                      <div className="text-sm whitespace-pre-line">
                        {card.frontSideComment}
                      </div>
                    </div>
                    <ChevronRight className="size-10 sm:rotate-0 rotate-90 text-muted-foreground w-10 shrink-0" />
                    <div className="sm:flex-[7] w-full space-y-2">
                      <div className="font-semibold">{card.backSide}</div>
                      <div className="text-sm whitespace-pre-line">
                        {card.backSideComment}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="min-w-[250px] md:block hidden">
          <AdSense />
        </div>

        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          <AlertDialogContent aria-describedby="end-test">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Bạn có muốn xoá bộ flashcard <i>{flashcardSet?.title}</i> này
                không?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter className="w-fit mx-auto">
              <AlertDialogAction onClick={handleDeleteFlashcardSet}>
                Xoá
              </AlertDialogAction>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <LoginPrompt open={loginPromptOpen} onOpenChange={setLoginPromptOpen} />
      <FlashcardSetRegisterPrompt
        isForbidden={isForbidden}
        open={flashcardRegisterPromptOpen}
        onOpenChange={setFlashcardRegisterPromptOpen}
        onRegister={handleRegisterFlashcardSet}
        disabled={isMutatingStartLearning}
      />
    </div>
  );
}
