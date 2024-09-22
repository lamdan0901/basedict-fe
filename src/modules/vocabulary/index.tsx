"use client";

import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounceFn } from "@/hooks/useDebounce";
import { useQueryParams } from "@/hooks/useQueryParam";
import { cn, stringifyParams } from "@/lib";
import { VocabItem } from "@/modules/vocabulary/VocabItem";
import { AppPagination } from "@/components/AppPagination";
import { getRequest } from "@/service/data";
import { Search, X } from "lucide-react";
import { useParams } from "next/navigation";
import { MouseEvent, useRef, useState } from "react";
import useSWR from "swr";
import { scrollToTop } from "@/lib";
import { MeaningPopup } from "@/components/TranslationPopup/MeaningPopup";
import { AddNewFlashcardModal } from "@/components/AddNewFlashcardModal";
import { useFavoriteStore } from "@/store/useFavoriteStore";
import { HistoryItemType } from "@/constants";
import { v4 as uuid } from "uuid";

const TOP_EL_ID = "top-of-vocabulary";

export function Vocabulary() {
  const jlptLevel = useParams().level?.[0] ?? "N3";
  const { addFavoriteItem, removeFavoriteItem, isFavoriteItem } =
    useFavoriteStore();
  const [selectedLexeme, setSelectedLexeme] = useState<{
    lexeme: TLexeme;
    currentMeaning: TMeaning;
  } | null>(null);

  const meaningPopupRef = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState("");
  const [showMeaningPopup, setShowMeaningPopup] = useState(false);
  const [popupTriggerPosition, setPopupTriggerPosition] = useState({
    top: 0,
    left: 0,
  });

  const [searchParams, setSearchParams] = useQueryParams({
    search: "",
    jlptLevel: jlptLevel,
    limit: 30,
    offset: 1,
  });
  const [searchText, setSearchText] = useState(searchParams.search);

  const { data, isLoading } = useSWR<{ data: TLexeme[]; total: number }>(
    `/v1/lexemes/?${stringifyParams(searchParams)}`,
    getRequest
  );
  const lexemes = data?.data ?? [];
  const total = data?.total ?? 0;

  const debouncedSearch = useDebounceFn((value: string) => {
    setSearchParams({ search: value });
  });

  function handleSearch(text: string) {
    setSearchText(text);
    debouncedSearch(text);
  }

  const handleSimilarWordClick = (
    lexeme: string,
    e: MouseEvent<HTMLDivElement>
  ) => {
    setShowMeaningPopup(true);
    setSelection(lexeme);
    setPopupTriggerPosition({
      top: e.clientY,
      left: e.clientX,
    });
  };

  function toggleFavorite(lexeme: TLexeme, isFavorite: boolean) {
    if (isFavorite) {
      removeFavoriteItem(lexeme.id);
    } else {
      addFavoriteItem({
        ...lexeme,
        uid: uuid(),
        type: HistoryItemType.Lexeme,
      });
    }
  }

  return (
    <div className="space-y-4">
      <div id={TOP_EL_ID} className="relative">
        <Input
          value={searchText}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          type="text"
          placeholder="Tìm từ vựng..."
        />
        <Search
          className={cn(
            "absolute size-4 right-3 top-1/2 -translate-y-1/2",
            searchText && "hidden"
          )}
        />
        <Button
          variant={"ghost"}
          onClick={() => {
            handleSearch("");
          }}
          className={cn(
            "rounded-full px-1 h-7 absolute right-2 top-1/2 -translate-y-1/2",
            searchText ? "flex" : "hidden"
          )}
        >
          <X className="size-5" />
        </Button>
      </div>

      {isLoading ? (
        <div>Đang tải...</div>
      ) : lexemes?.length === 0 ? (
        <div>Không tìm thấy từ vựng nào</div>
      ) : (
        <div className="space-y-6">
          {lexemes?.map((lexeme) => (
            <VocabItem
              key={lexeme.id}
              onAddFlashcard={setSelectedLexeme}
              lexeme={lexeme}
              isFavorite={isFavoriteItem(lexeme?.id)}
              onToggleFavorite={(isFavorite) => {
                toggleFavorite(lexeme, isFavorite);
              }}
              onSimilarWordClick={handleSimilarWordClick}
            />
          ))}
        </div>
      )}

      <AppPagination
        total={total}
        offset={searchParams.offset}
        limit={searchParams.limit}
        onPageChange={(offset) => {
          scrollToTop(`#${TOP_EL_ID}`);
          setSearchParams({ offset: offset });
        }}
      />

      {showMeaningPopup && (
        <MeaningPopup
          ref={meaningPopupRef}
          selection={selection}
          popupTriggerPosition={popupTriggerPosition}
          showPopup={showMeaningPopup}
          setShowPopup={setShowMeaningPopup}
        />
      )}

      <AddNewFlashcardModal
        {...selectedLexeme}
        open={!!selectedLexeme}
        onOpenChange={() => setSelectedLexeme(null)}
      />

      <ScrollToTopButton id={`#${TOP_EL_ID}`} />
    </div>
  );
}
