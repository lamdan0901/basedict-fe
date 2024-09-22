import { Button } from "@/components/ui/button";
import { DEFAULT_AVATAR_URL } from "@/constants";
import { FLASHCARD_SETS_LIMIT } from "@/modules/flashcard/const";
import { FlashcardItem } from "@/modules/flashcard/components/FlashcardItem";
import { getRequest } from "@/service/data";
import { fetchUserProfile } from "@/service/user";
import { CheckCheck, CircleHelp, GraduationCap, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { CardIcon } from "@/components/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function MyFlashcard() {
  const { data: user } = useSWR<TUser>("get-user", fetchUserProfile);
  const { data: myFlashcardSet, isLoading } = useSWR<TMyFlashcard>(
    `/v1/flash-card-sets/my-flash-card`,
    getRequest
  );

  const myFlashCards = myFlashcardSet?.myFlashCards ?? [];
  const learningFlashCards = myFlashcardSet?.learningFlashCards ?? [];
  const total = (myFlashCards?.length ?? 0) + (learningFlashCards?.length ?? 0);
  const totalLearnedNumber = myFlashcardSet?.totalLearnedNumber ?? 0;
  const totalLearningNumber = myFlashcardSet?.totalLearningNumber ?? 0;
  const limitReached = total === FLASHCARD_SETS_LIMIT;

  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={0}>
      <div className="space-y-4">
        <div className="flex pb-4 border-b border-muted-foreground items-center gap-4">
          <Image
            src={user?.avatar || DEFAULT_AVATAR_URL}
            width={80}
            height={80}
            className="rounded-full size-20 object-cover shrink-0"
            alt="owner-avatar"
          />
          <div className="space-y-4">
            <span className="text-lg font-semibold">{user?.name}</span>
            <div className="flex gap-2">
              <div className="bg-slate-50 gap-1 flex rounded-full px-2 text-sm border">
                <CardIcon width={20} height={20} /> {total} bộ flashcard
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-slate-50 gap-1 flex rounded-full px-2 text-sm border">
                    <GraduationCap className="size-5" />
                    <span>{totalLearningNumber} người</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Số người đang học</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-slate-50 gap-1 flex rounded-full px-2 text-sm border">
                    <CheckCheck className="size-5" />
                    <span>{totalLearnedNumber} lượt</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Số người đã học</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 items-center">
          <span>
            {total}/{FLASHCARD_SETS_LIMIT}
          </span>
          <Link
            className={limitReached ? "pointer-events-none" : ""}
            href="/flashcard/create"
          >
            <Button size={"sm"} disabled={limitReached}>
              <Plus className="size-5 mr-2" /> Tạo bộ Flashcard
            </Button>
          </Link>
        </div>

        <div>
          <div className="flex items-center mb-2  justify-between">
            <h2 className="text-lg font-semibold">Flashcard của tôi</h2>
            <div className="flex text-muted-foreground items-center ">
              <i>
                Bạn chỉ có thể tạo và theo học tối đa {FLASHCARD_SETS_LIMIT} bộ
              </i>
              <CircleHelp className="size-5 ml-2" />
            </div>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {isLoading ? (
              <span>Đang tải...</span>
            ) : !myFlashCards.length ? (
              <span>Bạn chưa tạo flashcard nào</span>
            ) : null}
            {myFlashCards.map((card) => (
              <FlashcardItem key={card.id} card={card} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg mb-2 pt-4 font-semibold">
            Flashcard đang theo học
          </h2>
          <div className="grid gap-4 xl:grid-cols-2">
            {isLoading ? (
              <span>Đang tải...</span>
            ) : !learningFlashCards.length ? (
              <span>Bạn chưa có flashcard nào đang theo học</span>
            ) : null}
            {learningFlashCards.map((card) => (
              <FlashcardItem key={card.id} card={card} />
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
