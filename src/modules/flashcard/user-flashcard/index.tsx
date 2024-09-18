import { DEFAULT_AVATAR_URL } from "@/constants";
import { FlashcardItem } from "@/modules/flashcard/components/FlashcardItem";
import { getRequest } from "@/service/data";
import { BookCopy, CheckCheck, GraduationCap } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import useSWR from "swr";

export function UserFlashcard() {
  const { userId } = useParams();

  const { data: owner, isLoading } = useSWR<TFlashcardSetOwner>(
    `/v1/flash-card-sets/user/${userId}`,
    getRequest
  );
  const flashcards = owner?.flashCardSets ?? [];
  const total = flashcards?.length ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex pb-4 border-b border-muted-foreground items-center gap-4">
        <Image
          src={owner?.avatar || DEFAULT_AVATAR_URL}
          width={80}
          height={80}
          className="rounded-full size-20 object-cover shrink-0"
          alt="owner-avatar"
        />
        <div className="space-y-4">
          <span className="text-lg font-semibold">{owner?.name}</span>
          <div className="flex gap-2">
            <div className="bg-slate-50 gap-1 flex rounded-full px-2 text-sm border">
              <BookCopy className="size-5" /> {total} bộ flashcard
            </div>
            <div className="bg-slate-50 gap-1 flex rounded-full px-2 text-sm border">
              <GraduationCap className="size-5" />
              <span>{owner?.totalLearnedNumber ?? 0} người</span>
            </div>
            <div className="bg-slate-50 gap-1 flex rounded-full px-2 text-sm border">
              <CheckCheck className="size-5" />
              <span>{owner?.totalLearningNumber ?? 0} lượt</span>
            </div>
          </div>
        </div>
      </div>

      {isLoading && <span>Đang tải...</span>}

      <div className="grid gap-4 xl:grid-cols-2">
        {flashcards.map((card) => (
          <FlashcardItem key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
