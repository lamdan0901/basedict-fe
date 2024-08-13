import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUrlSearchParams } from "@/hooks/useUrlSearchParams";
import { cn, stringifyParams, trimAllSpaces } from "@/lib";
import { getRequest } from "@/service/data";
import { useState, KeyboardEvent, useEffect, ChangeEvent, useRef } from "react";
import useSWRImmutable from "swr/immutable";
import { useSearchParams } from "next/navigation";
import { useLexemeStore } from "@/store/useLexemeStore";
import { SimilarWords } from "@/modules/home/LexemeSearch/SimilarWords";
import { GRAMMAR_CHAR } from "@/constants";

type LexemeSearchProps = {
  lexemeSearch: TLexeme | undefined;
};

export function LexemeSearch({ lexemeSearch }: LexemeSearchProps) {
  const {
    text,
    setText,
    selectedVocab,
    setSelectedVocab,
    setVocabMeaningErrMsg,
    selectedGrammar,
    setSelectedGrammar,
    setGrammarMeaningErrMsg,
    setWord,
    setGrammar,
  } = useLexemeStore();

  const initTextSet = useRef(false);
  const setSearchParam = useUrlSearchParams();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const [readyToSearch, setReadyToSearch] = useState(false);

  const isVocabMode = search && !search.startsWith(GRAMMAR_CHAR);
  const isGrammarMode = search.length > 1 && search.startsWith(GRAMMAR_CHAR);

  const {
    data: lexemeVocabRes,
    isLoading: loadingLexemeVocab,
    mutate: mutateLexemeVocab,
  } = useSWRImmutable<{
    data: TLexeme[];
  }>(
    isVocabMode
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
    data: lexemeGrammarRes,
    isLoading: loadingLexemeGrammar,
    mutate: mutateLexemeGrammar,
  } = useSWRImmutable<{
    data: TGrammar[];
  }>(
    isGrammarMode
      ? `v1/grammars/?search=?${trimAllSpaces(search.slice(1))}`
      : null,
    getRequest
  );
  const lexemeVocabs = lexemeVocabRes?.data ?? [];
  const lexemeGrammars = lexemeGrammarRes?.data ?? [];
  const isDisplayingSuggestions =
    lexemeVocabs.length > 0 || lexemeGrammars.length > 0;

  const lexemeToShowHanviet = selectedVocab ?? lexemeSearch;
  const hanviet = lexemeToShowHanviet?.hanviet
    ? "(" + lexemeToShowHanviet.hanviet + ")"
    : "";
  const lexemeHanViet = lexemeToShowHanviet
    ? lexemeToShowHanviet.standard === lexemeToShowHanviet.lexeme
      ? `${lexemeToShowHanviet.hiragana} ${hanviet}`
      : `${lexemeToShowHanviet.hiragana} ${lexemeToShowHanviet.lexeme} ${hanviet}`
    : "";

  function handleSearchTextChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setText(value);
    setSearchParam({ search: value });

    if (value.trim().length === 0) {
      setSearchParam({ search: "" });
      mutateLexemeVocab({ data: [] });
      setWord("");
      setGrammar("");
      setSelectedGrammar(null);
      setSelectedVocab(null);
    }
  }

  function handleSearchLexeme(e: KeyboardEvent<HTMLInputElement>) {
    if (!(e.key === "Enter" && text)) return;

    // when user press Enter, we need to cancel the request to get vocab list
    setSearchParam({ search: "" });

    if (isVocabMode) {
      setWord(text);
      setVocabMeaningErrMsg("");
      mutateLexemeVocab({ data: [] });
    } else {
      setGrammar(text);
      setGrammarMeaningErrMsg("");
      setSelectedGrammar(null);
      mutateLexemeGrammar({ data: [] });
    }
  }

  function handleVocabClick(lexeme: TLexeme) {
    setSelectedVocab(lexeme);
    setSearchParam({ search: "" });
    setText(lexeme.standard);
    setWord(lexeme.lexeme);
  }

  function handleGrammarClick(grammar: TGrammar) {
    setSelectedGrammar(grammar);
    setSearchParam({ search: "" });
    setText(grammar.grammar);
  }

  // After user select a lexeme from the list, user can click on that word again to search for similar ones
  useEffect(() => {
    if (readyToSearch) {
      setSearchParam({ search: text });
      setReadyToSearch(false);
    }
  }, [setSearchParam, text, readyToSearch]);

  useEffect(() => {
    if (search && !text && !initTextSet.current) {
      setText(search);
    }
    initTextSet.current = true;
  }, [search, setText, text]);

  return (
    <div className="w-full h-fit">
      <Card className="rounded-2xl">
        <CardContent className={cn("!p-4 sm:min-h-[325px]")}>
          <Input
            id="lexeme-search"
            value={text}
            autoFocus
            type="search"
            onChange={handleSearchTextChange}
            onClick={() => {
              if (text && !readyToSearch) {
                setReadyToSearch(true);
              }
            }}
            onKeyDown={handleSearchLexeme}
            placeholder="Thêm 〜 để tìm kiếm ngữ pháp"
            className="border-none px-1 sm:placeholder:text-2xl placeholder:text-lg text-[26px] sm:text-3xl focus-visible:ring-transparent"
          />
          {lexemeHanViet}
          {(lexemeVocabs.length > 0 || lexemeGrammars.length > 0) && (
            <div className="w-full h-px bg-muted-foreground "></div>
          )}
          <div
            className={cn(
              "flex flex-col gap-6 overflow-auto sm:h-[220px] h-[137px] items-start mt-3",
              !isDisplayingSuggestions && "h-auto"
            )}
          >
            {loadingLexemeVocab
              ? "Searching..."
              : lexemeVocabs.map((lexeme) => {
                  const lexemeStandard =
                    lexeme.standard === lexeme.lexeme
                      ? lexeme.standard
                      : `${lexeme.standard} ${lexeme.lexeme}`;
                  return (
                    <Button
                      key={lexeme.id}
                      onClick={() => handleVocabClick(lexeme)}
                      className="items-center text-lg sm:text-xl py-7 font-normal relative px-1 w-full flex-col"
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

            {loadingLexemeGrammar
              ? "Searching..."
              : lexemeGrammars.map((grammar) => {
                  return (
                    <Button
                      key={grammar.id}
                      onClick={() => handleGrammarClick(grammar)}
                      className="items-center text-xl py-7 font-normal relative px-1 w-full flex-col"
                      variant="ghost"
                    >
                      <span>{grammar.grammar}</span>
                      <span>{grammar.meaning}</span>
                      <div className="w-full h-px bg-muted-foreground absolute -bottom-2 left-0"></div>
                    </Button>
                  );
                })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
