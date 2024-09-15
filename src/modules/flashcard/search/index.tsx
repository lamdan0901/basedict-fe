import useSWR from "swr";
import { getRequest } from "@/service/data";
import { useQueryParam } from "@/hooks/useQueryParam";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";

export function FlashcardSearch() {
  const [sortBy, setSortBy] = useQueryParam("sortBy", "popular");
  const debouncedSortBy = useDebounce(sortBy);

  const { data: flashcardSearch, isLoading: isSearching } = useSWR<{
    data: TFlashCard[];
    total: number;
  }>(`/v1/flash-card-sets/discover?sort=${debouncedSortBy}`, getRequest);

  return (
    <div>
      <Input
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        type="text"
        placeholder="Tìm flashcard..."
      />
    </div>
  );
}
