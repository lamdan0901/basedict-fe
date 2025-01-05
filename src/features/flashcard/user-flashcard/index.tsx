"use client";

import { AdSense } from "@/components/ui/ad";
import { FlashcardItem } from "@/features/flashcard/components/FlashcardItem";
import { UserFlashcardSetHeader } from "@/features/flashcard/components/UserFlashcardSetHeader";

export function UserFlashcard({
  owner,
}: {
  owner: TFlashcardSetOwner | undefined;
}) {
  const flashcards = owner?.flashCardSets ?? [];
  const total = flashcards?.length ?? 0;

  return (
    <div>
      <div className="space-y-4">
        <UserFlashcardSetHeader
          avatar={owner?.avatar}
          name={owner?.name}
          totalSet={total}
          totalLearningNumber={owner?.totalLearningNumber}
          totalLearnedNumber={owner?.totalLearnedNumber}
        />

        <div className="grid gap-4 xl:grid-cols-2">
          {flashcards.map((card) => (
            <FlashcardItem key={card.id} card={card} />
          ))}
        </div>
      </div>

      <AdSense slot="horizontal" />
    </div>
  );
}
