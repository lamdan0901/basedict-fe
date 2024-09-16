import { useParams } from "next/navigation";
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

export function UserFlashcard() {
  const { userId } = useParams();
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

  return <div>{userId};</div>;
}
