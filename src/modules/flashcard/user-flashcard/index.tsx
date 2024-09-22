import { CardIcon } from "@/components/icons";
import { DEFAULT_AVATAR_URL } from "@/constants";
import { FlashcardItem } from "@/modules/flashcard/components/FlashcardItem";
import { getRequest } from "@/service/data";
import { CheckCheck, GraduationCap } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import useSWR from "swr";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function UserFlashcard() {
  const { userId } = useParams();

  const { data: owner, isLoading } = useSWR<TFlashcardSetOwner>(
    `/v1/flash-card-sets/user/${userId}`,
    getRequest
  );
  const flashcards = owner?.flashCardSets ?? [];
  const total = flashcards?.length ?? 0;

  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={0}>
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
                <CardIcon width={20} height={20} /> {total} bộ flashcard
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-slate-50 gap-1 flex rounded-full px-2 text-sm border">
                    <GraduationCap className="size-5" />
                    <span>{owner?.totalLearningNumber} người</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Số người đang học</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-slate-50 gap-1 flex rounded-full px-2 text-sm border">
                    <CheckCheck className="size-5" />
                    <span>{owner?.totalLearnedNumber} lượt</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Số người đã học</TooltipContent>
              </Tooltip>
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
    </TooltipProvider>
  );
}
