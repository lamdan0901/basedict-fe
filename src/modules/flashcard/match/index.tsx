import { AdSense } from "@/components/Ad";
import { shuffleArray } from "@/lib";
import { RegisterRequiredWrapper } from "@/modules/flashcard/components/RegisterRequiredWrapper";
import { MatchGrid } from "@/modules/flashcard/match/MatchGrid";
import {
  MatchTimer,
  MatchTimerRef,
} from "@/modules/flashcard/match/MatchTimer";
import { OptionsSelector } from "@/modules/flashcard/match/OptionSelector";
import { useAppStore } from "@/store/useAppStore";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { flashcardRepo } from "@/lib/supabase/client";

export function FlashcardMatching() {
  const timerRef = useRef<MatchTimerRef>(null);
  const searchParams = useSearchParams();
  const { flashcardId } = useParams();
  const userId = useAppStore((state) => state.profile?.id);

  const [flashcardRegisterPromptOpen, setFlashcardRegisterPromptOpen] =
    useState(false);
  const [flashCards, setFlashCards] = useState<TFlashCardItem[]>([]);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const { data: flashcardSet, isLoading } = useSWR<TFlashcardSet>(
    userId && flashcardId ? ["flashcardSet", flashcardId, userId] : null,
    () => flashcardRepo.getFlashcardSetById(flashcardId as string, userId)
  );

  const isMyFlashcard = userId === flashcardSet?.owner?.id;
  const flashCardsLength = flashcardSet?.flashCards?.length ?? 0;
  const option = searchParams.get("option") || "6";

  useEffect(() => {
    const _flashcardSet = flashcardSet?.flashCards ?? [];
    setFlashCards(shuffleArray(_flashcardSet).slice(0, +option));
  }, [flashcardSet?.flashCards, option]);

  useEffect(() => {
    if (!isLoading && !isMyFlashcard && !flashcardSet?.isLearning) {
      setFlashcardRegisterPromptOpen(true);
    }
  }, [isLoading, flashcardSet?.isLearning, isMyFlashcard]);

  if (isLoading) return <div>Đang tải bộ flashcard...</div>;
  if (!flashcardSet) return <div>Không tìm thấy bộ flashcard</div>;

  return (
    <RegisterRequiredWrapper
      open={flashcardRegisterPromptOpen}
      onOpenChange={setFlashcardRegisterPromptOpen}
    >
      <div className="relative">
        <OptionsSelector
          option={option}
          restart={() => timerRef.current?.restart()}
          flashCardsLength={flashCardsLength}
        />
        <MatchTimer ref={timerRef} isRunning={isTimerRunning} />
        <MatchGrid
          flashCards={flashCards}
          resetTimer={() => timerRef.current?.reset()}
          toggleTimerRunning={setIsTimerRunning}
        />
      </div>

      <AdSense slot="horizontal" />
    </RegisterRequiredWrapper>
  );
}
