"use client";

import { AppPagination } from "@/shared/ui";
import { ScrollToTopButton } from "@/components/ui/scroll-to-top-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounceFn } from "@/shared/hooks/useDebounce";
import { useQueryParams } from "@/shared/hooks/useQueryParam";
import {
  formatQuizNFlashcardSearchParams,
  scrollToTop,
  stringifyParams,
} from "@/shared/lib";
import { Searchbar } from "@/shared/ui";
import { getRequest } from "@/service/data";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { AdSense } from "@/components/ui/ad";
import { QuizItem } from "@/features/quizzes/components/QuizItem";
import { quizSortMap } from "@/features/quizzes/const";
import { useAppStore } from "@/store/useAppStore";
import { shallow } from "zustand/shallow";
import { jlptLevels } from "@/shared/constants";

const TOP_EL_ID = "top-of-quiz-search";

export function QuizzesSearch() {
  const { jlptLevel, isLoading: isLoadingProfile } = useAppStore(
    (state) => ({
      jlptLevel: state.profile?.jlptLevel,
      isLoading: state.isLoading,
    }),
    shallow
  );
  const defaultJlptLevel = isLoadingProfile ? undefined : jlptLevel;

  const [searchParams, setSearchParams] = useQueryParams({
    search: "",
    sort: "popular",
    jlptLevel: "all",
    offset: 1,
    limit: 20,
  });
  const [searchText, setSearchText] = useState(searchParams.search);
  const shouldSearchByTag = searchParams.search.startsWith("#");

  const { data: quizSearch, isLoading: isSearching } = useSWR<{
    data: TQuiz[];
    total: number;
  }>(
    !isLoadingProfile
      ? `/v1/exams/discover?${stringifyParams(
          formatQuizNFlashcardSearchParams(
            {
              ...searchParams,
              jlptLevel:
                searchParams.jlptLevel === "all"
                  ? undefined
                  : searchParams.jlptLevel,
            },
            shouldSearchByTag
          )
        )}`
      : null,
    getRequest
  );

  const quizzes = quizSearch?.data ?? [];
  const total = quizSearch?.total ?? 0;

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

  useEffect(() => {
    if (
      !isLoadingProfile &&
      searchParams.jlptLevel === "all" &&
      defaultJlptLevel
    ) {
      setSearchParams({ jlptLevel: defaultJlptLevel });
    }
  }, [
    defaultJlptLevel,
    isLoadingProfile,
    searchParams.jlptLevel,
    setSearchParams,
  ]);

  const isLoading = isLoadingProfile || isSearching;

  return (
    <div className="space-y-4">
      <div className="flex sm:flex-nowrap flex-wrap gap-2">
        <Searchbar
          id={TOP_EL_ID}
          value={searchText}
          onSearch={handleSearch}
          placeholder="Tìm đề thi..."
        />
        <Select
          value={searchParams.sort}
          onValueChange={(sort) => setSearchParams({ sort })}
        >
          <SelectTrigger className="sm:shrink-0 basis-[135px]">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(quizSortMap).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={searchParams.jlptLevel}
          onValueChange={(jlptLevel) => setSearchParams({ jlptLevel })}
        >
          <SelectTrigger className="sm:shrink-0 basis-[135px]">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"all"}>Tất cả</SelectItem>
            {jlptLevels.map(({ title, value }) => (
              <SelectItem key={value} value={value}>
                {title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <span>Đang tìm kiếm...</span>
      ) : quizzes.length === 0 ? (
        <span>Không có kết quả tìm kiếm</span>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        {quizzes.map((quiz) => (
          <QuizItem key={quiz.id} quiz={quiz} />
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
