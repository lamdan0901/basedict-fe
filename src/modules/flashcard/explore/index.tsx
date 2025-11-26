"use client";

import { AdSense } from "@/components/Ad";
import { BadgeList } from "@/components/BadgeList";
import { Input } from "@/components/ui/input";
import { FlashcardCreator } from "@/modules/flashcard/components/FlashcardCreator";
import { FlashcardItem } from "@/modules/flashcard/components/FlashcardItem";
import { flashcardRepo } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import useSWR from "swr";

export function FlashcardExploring() {
  const router = useRouter();

  const { data: flashcardTags, isLoading: isLoadingTags } = useSWR<
    TFlashcardTag[]
  >("flashcardTags", () => flashcardRepo.getTags({ excludeEmpty: true }));

  const { data: flashcardDiscover, isLoading: isLoadingDiscover } = useSWR<{
    data: TFlashcardSet[];
    total: number;
  }>("flashcardDiscover", () => flashcardRepo.getDiscoverSets());

  const { data: topCreators = [], isLoading: isLoadingTopCreators } = useSWR<
    TFlashcardCreator[]
  >("topCreators", () => flashcardRepo.getTopCreators());

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
          {!isLoadingDiscover &&
            flashcards.length === 0 &&
            "Chưa có flashcard nào"}
        </div>
        <Link
          className="text-blue-500 hover:underline block w-fit ml-auto mt-2"
          href="/flashcard/search"
        >
          Tìm kiếm thêm
        </Link>
      </div>

      <BadgeList
        isLoading={isLoadingTags}
        className="px-0 pb-4"
        titleClassName="font-semibold w-full"
        title="Các tag phổ biến"
        words={flashcardTags?.map((tag) => `${tag.name} (${tag.count})`)}
        onWordClick={(tag) => {
          const q = `search=%23${tag.split("(")[0].trim()}`;
          router.push(`/flashcard/search?${q}`);
        }}
      />

      <div>
        <h2 className="text-lg mb-2 font-semibold">Top 5 người đóng góp</h2>
        {isLoadingTopCreators && "Đang tải..."}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topCreators.map((creator, i) => (
            <FlashcardCreator key={i} creator={creator} />
          ))}
          {!isLoadingTopCreators &&
            topCreators.length === 0 &&
            "Chưa có người đóng góp nào"}
        </div>
      </div>

      <AdSense slot="horizontal" />
    </div>
  );
}
