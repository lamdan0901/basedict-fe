"use client";

import { AdSense } from "@/components/Ad";
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
import {
  FLASHCARD_SETS_LIMIT_MSG,
  MIN_CARDS_TO_MATCH,
} from "@/modules/flashcard/const";
import { MatchingOptionSelector } from "@/modules/flashcard/detail/MatchingOptionSelector";
import { deleteRequest, getRequest, postRequest } from "@/service/data";
import { useAppStore } from "@/store/useAppStore";
import { Check, CheckCheck, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";

export function FlashcardDetail() {
  const { toast } = useToast();
  const router = useRouter();
  const { flashcardId } = useParams();
  const userId = useAppStore((state) => state.profile?.id);

  const [matchingOptionOpen, setMatchingOptionOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [flashcardRegisterPromptOpen, setFlashcardRegisterPromptOpen] =
    useState(false);
  const [isForbidden, setIsForbidden] = useState(false);

  const {
    data: flashcardSet,
    isLoading,
    mutate: mutateFlashcardSet,
  } = useSWR<TFlashcardSet>(`/v1/flash-card-sets/${flashcardId}`, getRequest);
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

  const flashCardsLength = flashcardSet?.flashCards?.length || 0;
  const isMyFlashcard = userId === flashcardSet?.owner?.id;
  const canMatch = flashCardsLength >= MIN_CARDS_TO_MATCH;
  const isTogglingLearning = isMutatingStartLearning || isMutatingStopLearning;
  const learningStatusTitle = flashcardSet?.isLearning
    ? "Huỷ đăng kí"
    : "Đăng kí học";

  async function toggleLearningStatus() {
    if (!userId) {
      setLoginPromptOpen(true);
      return;
    }

    try {
      await (flashcardSet?.isLearning ? stopLearning() : startLearning());

      await Promise.all([
        mutate("/v1/flash-card-sets/my-flash-card"),
        mutateFlashcardSet(),
      ]);
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

  function canGoToLearning() {
    if (!userId) {
      setLoginPromptOpen(true);
      return false;
    }
    if (!isMyFlashcard && !flashcardSet?.isLearning) {
      setFlashcardRegisterPromptOpen(true);
      return false;
    }
    return true;
  }

  function handleStartLearning() {
    if (!canGoToLearning()) return;

    router.push(`/flashcard/${flashcardId}/learn`);
  }

  function handleFlashcardMatching() {
    if (!canGoToLearning()) return;
    if (!canMatch) {
      toast({
        title: `Bạn cần ít nhất ${MIN_CARDS_TO_MATCH} thẻ để thực hiện flashcard matching`,
        variant: "destructive",
      });
      return;
    }

    setMatchingOptionOpen(true);
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

        <div className="flex gap-2 pt-4 border-t border-muted-foreground flex-wrap justify-center">
          <Button onClick={handleStartLearning}>Bắt đầu học</Button>
          <Button onClick={handleFlashcardMatching}>Flashcard Matching</Button>
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

        <AdSense slot="horizontal" />

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

      <MatchingOptionSelector
        open={matchingOptionOpen}
        onClick={(selectedOption) =>
          router.push(
            `/flashcard/${flashcardId}/match?option=${selectedOption}`
          )
        }
        flashCardsLength={flashCardsLength}
        onOpenChange={setMatchingOptionOpen}
      />
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
