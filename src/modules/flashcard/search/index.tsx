"use client";

import { AppPagination } from "@/components/AppPagination";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounceFn } from "@/hooks/useDebounce";
import { scrollToTop } from "@/lib";
import { flashcardSortMap } from "@/modules/flashcard/const";
import { FlashcardItem } from "@/modules/flashcard/components/FlashcardItem";
import { Searchbar } from "@/components/Searchbar";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { AdSense } from "@/components/Ad";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { flashcardRepo } from "@/lib/supabase/client";

const TOP_EL_ID = "top-of-flashcard-search";

export function FlashcardSearch() {
  const [searchParams, setSearchParams] = useQueryStates({
    search: parseAsString.withDefault(""),
    sort: parseAsString.withDefault("popular"),
    limit: parseAsInteger.withDefault(20),
    offset: parseAsInteger.withDefault(1),
  });
  const [searchText, setSearchText] = useState(searchParams.search);
  const shouldSearchByTag = searchParams.search.startsWith("#");

  const { data: flashcardSearch, isLoading: isSearching } = useSWR(
    ["flashcard-search", searchParams],
    async () =>
      flashcardRepo.searchFlashcardSets({
        search: searchParams.search,
        tagName: shouldSearchByTag ? searchParams.search.slice(1) : undefined,
        sort: searchParams.sort as "popular" | "updated_at",
        limit: searchParams.limit,
        offset: (searchParams.offset - 1) * searchParams.limit,
      })
  );
  const flashcards = flashcardSearch?.data ?? [];
  const total = flashcardSearch?.total ?? 0;

  const debouncedSearch = useDebounceFn((value: string) => {
    setSearchParams({ search: value });
  });

  function handleSearch(text: string) {
    setSearchText(text);
    debouncedSearch(text);
  }

  useEffect(() => {
    setSearchText(searchParams.search);
  }, [searchParams.search]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Searchbar
          id={TOP_EL_ID}
          value={searchText}
          onSearch={handleSearch}
          placeholder="Tìm flashcard..."
        />
        <Select
          value={searchParams.sort}
          onValueChange={(sort) => setSearchParams({ sort })}
        >
          <SelectTrigger className="shrink-0 basis-[135px]">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(flashcardSortMap).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        {isSearching
          ? "Đang tìm kiếm..."
          : flashcards.length === 0
          ? "Không có kết quả tìm kiếm"
          : null}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {flashcards.map((card) => (
          <FlashcardItem key={card.id} card={card} />
        ))}
      </div>

      <AppPagination
        total={total}
        offset={searchParams.offset}
        limit={searchParams.limit}
        onPageChange={(offset) => {
          scrollToTop(`#${TOP_EL_ID}`);
          setSearchParams({ offset: offset });
        }}
      />

      <ScrollToTopButton id={`#${TOP_EL_ID}`} />

      <AdSense slot="horizontal" />
    </div>
  );
}
