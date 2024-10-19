"use client";

import { AdSense } from "@/components/Ad/Ad";
import { BadgeList } from "@/components/BadgeList";
import { Input } from "@/components/ui/input";
import { FlashcardCreator } from "@/modules/flashcard/components/FlashcardCreator";
import { FlashcardItem } from "@/modules/flashcard/components/FlashcardItem";
import { getRequest } from "@/service/data";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";

export function FlashcardExploring() {
  const router = useRouter();

  const { data: flashcardTags } = useSWR<TFlashcardTag[]>(
    "/v1/flash-card-sets/tags",
    getRequest
  );

  const { data: flashcardDiscover, isLoading: isLoadingDiscover } = useSWR<{
    data: TFlashcardSet[];
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
            <FlashcardItem key={card.id} hiddenDate card={card} />
          ))}
        </div>
        <Link
          className="text-blue-500 hover:underline block w-fit ml-auto mt-2"
          href="/flashcard/search"
        >
          Tìm kiếm thêm
        </Link>
      </div>

      <BadgeList
        className="px-0 pb-4"
        titleClassName="font-semibold w-full"
        title="Các tag phổ biến"
        words={flashcardTags?.map((tag) => `${tag.name} (${tag.count})`)}
        onWordClick={(tag) => {
          tag = `q=~%28search~%27*23${tag.split("(")[0].trim()}%29`;
          router.push(`/flashcard/search?${tag}`);
        }}
      />

      <div>
        <h2 className="text-lg mb-2 font-semibold">Top 5 người đóng góp</h2>
        {isLoadingTopCreators && "Đang tải..."}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topCreators.map((creator, i) => (
            <FlashcardCreator key={i} creator={creator} />
          ))}
        </div>
      </div>

      <AdSense slot="horizontal" />
    </div>
  );
}
