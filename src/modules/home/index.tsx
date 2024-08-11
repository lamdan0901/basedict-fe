"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MEANING_ERR_MSG } from "@/constants";
import { useUrlSearchParams } from "@/hooks/useUrlSearchParams";
import { stringifyParams, trimAllSpaces } from "@/lib";
import { MeaningSection } from "@/modules/home/MeaningSection";
import { SimilarWords } from "@/modules/home/SimilarWords";
import { TranslationPopup } from "@/modules/home/TranslationPopup";
import { getRequest } from "@/service/data";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWRImmutable from "swr/immutable";

const MAX_LINES = 3;

export function Home() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const setSearchParam = useUrlSearchParams();
  const [text, setText] = useState(search);
  const [word, setWord] = useState("");

  const [selectedLexeme, setSelectedLexeme] = useState<TLexeme | null>(null);
  const [readyToSearch, setReadyToSearch] = useState(false);
  const [meaningErrMsg, setMeaningErrMsg] = useState("");

  const {
    data: lexemeListRes,
    isLoading: loadingLexemeList,
    mutate,
  } = useSWRImmutable<{
    data: TLexeme[];
  }>(
    search
      ? `/v1/lexemes?${stringifyParams({
          search: trimAllSpaces(search),
          sort: "frequency_ranking",
          orderDirection: "asc",
          isMaster: true,
        })}`
      : null,
    getRequest
  );
  const {
    data: lexemeSearch,
    isLoading: loadingLexemeSearch,
    mutate: retryLexemeSearch,
  } = useSWRImmutable<TLexeme>(
    word ? `/v1/lexemes/search/${trimAllSpaces(word)}` : null,
    getRequest,
    {
      onError(errMsg) {
        setMeaningErrMsg(
          MEANING_ERR_MSG[errMsg as keyof typeof MEANING_ERR_MSG] ??
            MEANING_ERR_MSG.UNKNOWN
        );
        console.error("err searching lexeme: ", errMsg);
      },
    }
  );

  const lexemeList = lexemeListRes?.data ?? [];
  const wordIdToReport = lexemeSearch?.id || selectedLexeme?.id || "";

  const lexemeToShowHanviet = selectedLexeme ?? lexemeSearch;
  const hanviet = lexemeToShowHanviet?.hanviet
    ? "(" + lexemeToShowHanviet.hanviet + ")"
    : "";
  const lexemeHanViet = lexemeToShowHanviet
    ? lexemeToShowHanviet.standard === lexemeToShowHanviet.lexeme
      ? `${lexemeToShowHanviet.hiragana} ${hanviet}`
      : `${lexemeToShowHanviet.hiragana} ${lexemeToShowHanviet.lexeme} ${hanviet}`
    : "";

  // After user select a lexeme from the list, user can click on that word again to search for similar ones
  useEffect(() => {
    if (readyToSearch) {
      setSearchParam({ search: text });
      setReadyToSearch(false);
    }
  }, [setSearchParam, text, readyToSearch]);

  console.log("render...");

  return (
    <TranslationPopup>
      <div className="flex h-full  py-4 sm:flex-row flex-col gap-8 items-start">
        <div id="VOCAB_AND_GRAMMAR_SECTION" className="w-full h-fit relative">
          <Card className="rounded-2xl">
            <CardContent className="!p-4 h-[325px]">
              <Input
                value={text}
                autoFocus
                type="search"
                onChange={(e) => {
                  setText(e.target.value);
                  setSearchParam({ search: e.target.value });
                  if (selectedLexeme) setSelectedLexeme(null);
                  if (e.target.value.trim().length === 0) {
                    setSearchParam({ search: "" });
                    mutate({ data: [] });
                    setWord("");
                  }
                }}
                onClick={() => {
                  if (!readyToSearch) setReadyToSearch(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && text) {
                    setMeaningErrMsg("");
                    setWord(text);

                    // when user press Enter, we need to cancel the request to get lexeme list
                    setSearchParam({ search: "" });
                    mutate({ data: [] });
                  }
                }}
                placeholder="Thêm 〜 để tìm kiếm ngữ pháp"
                className="border-none px-1 text-3xl focus-visible:ring-transparent"
              />
              {lexemeHanViet}
              {lexemeList.length > 0 && (
                <div className="w-full h-px bg-muted-foreground "></div>
              )}
              <div className="flex flex-col gap-6 overflow-auto h-[220px] items-start mt-3">
                {loadingLexemeList
                  ? "Searching..."
                  : lexemeList.map((lexeme) => {
                      const lexemeStandard =
                        lexeme.standard === lexeme.lexeme
                          ? lexeme.standard
                          : `${lexeme.standard} ${lexeme.lexeme}`;
                      return (
                        <Button
                          key={lexeme.id}
                          onClick={() => {
                            setSelectedLexeme(lexeme);
                            setSearchParam({ search: "" });
                            setText(lexeme.standard);
                            setWord(lexeme.lexeme);
                          }}
                          className="items-center text-xl py-7 font-normal relative px-1 w-full flex-col"
                          variant="ghost"
                        >
                          <span>
                            {lexemeStandard}{" "}
                            {lexeme.hiragana ? `(${lexeme.hiragana})` : ""}
                          </span>
                          <span>{lexeme.hanviet}</span>
                          <div className="w-full h-px bg-muted-foreground absolute -bottom-2 left-0"></div>
                        </Button>
                      );
                    })}
              </div>
            </CardContent>
          </Card>

          <SimilarWords
            lexeme={lexemeSearch || selectedLexeme}
            onClick={(selectedSimilarWord) => {
              setSelectedLexeme(null);
              setSearchParam({ search: selectedSimilarWord });
              setText(selectedSimilarWord);
              setWord(selectedSimilarWord);
            }}
          />
        </div>

        <MeaningSection
          lexemeSearch={lexemeSearch}
          loadingLexemeSearch={loadingLexemeSearch}
          retryLexemeSearch={retryLexemeSearch}
          meaningErrMsg={meaningErrMsg}
          wordIdToReport={wordIdToReport}
        />
      </div>
    </TranslationPopup>
  );
}
