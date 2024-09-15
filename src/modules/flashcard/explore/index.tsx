import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DEFAULT_AVATAR_URL } from "@/constants";
import { getRequest } from "@/service/data";
import { CheckCheck, GraduationCap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

export function FlashcardExploring() {
  const { data: flashcardDiscover, isLoading: isLoadingDiscover } = useSWR<{
    data: TFlashCard[];
    total: number;
  }>("/v1/flash-card-sets/discover", getRequest);

  const { data: topCreators = [], isLoading: isLoadingTopCreators } = useSWR<
    TFlashcardCreator[]
  >("/v1/flash-card-sets/top-creator", getRequest);

  const flashcards = flashcardDiscover?.data ?? [];

  return (
    <div className="space-y-2">
      <div>
        <Link href="/flashcard/search">
          <Input type="text" placeholder="Tìm flashcard..." />
        </Link>
        <h2 className="text-lg mb-2 mt-4 font-semibold">
          Các bộ Flashcard phổ biến
        </h2>
        {isLoadingDiscover && "Đang tải..."}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {flashcards.map((card) => (
            <FlashcardItem key={card.id} card={card} />
          ))}
        </div>
        <Link
          className="text-blue-500 hover:underline block w-fit ml-auto mt-2"
          href="/flashcard/search"
        >
          Tìm kiếm thêm
        </Link>
      </div>

      <div>
        <h2 className="text-lg mb-2 font-semibold">Top 5 người đóng góp</h2>
        {isLoadingTopCreators && "Đang tải..."}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topCreators.map((creator, i) => (
            <FlashcardCreator key={i} creator={creator} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FlashcardItem({ card }: { card: TFlashCard }) {
  return (
    <Card>
      <CardContent className="p-2 hover:shadow-lg transition duration-300 sm:p-4">
        <div className="flex justify-between">
          <h2 className="font-semibold text-lg">{card.title}</h2>
          <div className="bg-slate-50 text-black rounded-full px-6 pt-1 text-sm border">
            {card.flashCardNumber} thẻ
          </div>
        </div>

        <p className="line-clamp-2 text-xs mt-2 mb-3">{card.description}</p>

        <div className="flex justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Image
              src={card.owner.avatar || DEFAULT_AVATAR_URL}
              width={40}
              height={40}
              className="rounded-full size-10 object-cover shrink-0"
              alt="owner-avatar"
            />
            <span>{card.owner.name}</span>
          </div>
          <div className="flex gap-3">
            <div className="flex gap-1 items-center text-xs">
              <GraduationCap className="size-5" />
              <span>{card.learnedNumber} người</span>
            </div>
            <div className="flex gap-1 items-center text-xs">
              <CheckCheck className="size-5" />
              <span>{card.learningNumber} lượt</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FlashcardCreator({ creator }: { creator: TFlashcardCreator }) {
  return (
    <Card>
      <CardContent className="p-2 space-y-4 hover:shadow-lg transition duration-300 sm:p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Image
            src={creator.avatar || DEFAULT_AVATAR_URL}
            width={40}
            height={40}
            className="rounded-full size-10 object-cover shrink-0"
            alt="owner-avatar"
          />
          <span className="font-semibold">{creator.name}</span>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="flex gap-1 items-center text-xs">
            <GraduationCap className="size-5" />
            <span>{creator.flashCardSetNumber} bộ flashcard</span>
          </div>
          <div className="flex gap-1 items-center text-xs">
            <GraduationCap className="size-5" />
            <span>{creator.totalLearnedNumber} người</span>
          </div>
          <div className="flex gap-1 items-center text-xs">
            <CheckCheck className="size-5" />
            <span>{creator.totalLearningNumber} lượt</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
