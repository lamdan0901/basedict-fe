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
import { useQueryParams } from "@/hooks/useQueryParam";
import { scrollToTop, stringifyParams } from "@/lib";
import { flashcardSortMap } from "@/modules/flashcard/const";
import { FlashcardItem } from "@/modules/flashcard/FlashcardItem";
import { Searchbar } from "@/modules/flashcard/Searchbar";
import { getRequest } from "@/service/data";
import { useState } from "react";
import useSWR from "swr";

const TOP_EL_ID = "top-of-flashcard-search";

export function FlashcardSearch() {
  const [searchParams, setSearchParams] = useQueryParams({
    search: "",
    sort: "popular",
    offset: 1,
    limit: 20,
  });
  const [searchText, setSearchText] = useState(searchParams.search);

  const { data: flashcardSearch, isLoading: isSearching } = useSWR<{
    data: TFlashCard[];
    total: number;
  }>(
    `/v1/flash-card-sets/discover?${stringifyParams(searchParams)}`,
    getRequest
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

      {isSearching ? (
        <span>Đang tìm kiếm...</span>
      ) : flashcards.length === 0 ? (
        <span>Không có kết quả tìm kiếm</span>
      ) : null}

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
    </div>
  );
}
