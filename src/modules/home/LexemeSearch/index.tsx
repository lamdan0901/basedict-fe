import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SimilarWords } from "@/modules/home/SimilarWords";
import { useUrlSearchParams } from "@/hooks/useUrlSearchParams";
import { stringifyParams, trimAllSpaces } from "@/lib";
import { getRequest } from "@/service/data";
import { useState, KeyboardEvent, useEffect, ChangeEvent } from "react";
import useSWRImmutable from "swr/immutable";
import { useSearchParams } from "next/navigation";

type LexemeSearchProps = {
  selectedLexeme: TLexeme | null;
  lexemeSearch: TLexeme | undefined;
  setMeaningErrMsg: (msg: string) => void;
  setWord: (word: string) => void;
  setSelectedLexeme: (lexeme: TLexeme | null) => void;
};

const GRAMMAR_CHAR = "〜";

// enum TranslationMode {
//   Vocab,
//   Grammar,
//   Paragraph,
// }

export function LexemeSearch({
  selectedLexeme,
  lexemeSearch,
  setMeaningErrMsg,
  setWord,
  setSelectedLexeme,
}: LexemeSearchProps) {
  const setSearchParam = useUrlSearchParams();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const [text, setText] = useState(search);
  const [readyToSearch, setReadyToSearch] = useState(false);

  const isVocabMode = !search.startsWith(GRAMMAR_CHAR);
  const isGrammarMode = search.startsWith(GRAMMAR_CHAR);

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
    isGrammarMode ? `v1/grammars/?search=?${trimAllSpaces(search)}` : null,
    getRequest
  );
  const lexemeVocabs = lexemeVocabRes?.data ?? [];
  const lexemeGrammars = lexemeGrammarRes?.data ?? [];

  const lexemeToShowHanviet = selectedLexeme ?? lexemeSearch;
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

    if (selectedLexeme) setSelectedLexeme(null);

    if (value.trim().length === 0) {
      setSearchParam({ search: "" });
      mutateLexemeVocab({ data: [] });
      setWord("");
    }
  }

  function handleSearchLexeme(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && text) {
      setMeaningErrMsg("");
      setWord(text);

      // when user press Enter, we need to cancel the request to get vocab list
      setSearchParam({ search: "" });
      mutateLexemeVocab({ data: [] });
    }
  }

  function handleVocabClick(lexeme: TLexeme) {
    setSelectedLexeme(lexeme);
    setSearchParam({ search: "" });
    setText(lexeme.standard);
    setWord(lexeme.lexeme);
  }

  function handleGrammarClick(grammar: TGrammar) {
    // setSelectedLexeme(lexeme);
    // setSearchParam({ search: "" });
    // setText(lexeme.standard);
    // setWord(lexeme.lexeme);
  }

  // After user select a lexeme from the list, user can click on that word again to search for similar ones
  useEffect(() => {
    if (readyToSearch) {
      setSearchParam({ search: text });
      setReadyToSearch(false);
    }
  }, [setSearchParam, text, readyToSearch]);

  return (
    <div className="w-full h-fit relative">
      <Card className="rounded-2xl">
        <CardContent className="!p-4 h-[325px]">
          <Input
            value={text}
            autoFocus
            type="search"
            onChange={handleSearchTextChange}
            onClick={() => {
              if (!readyToSearch) setReadyToSearch(true);
            }}
            onKeyDown={handleSearchLexeme}
            placeholder="Thêm 〜 để tìm kiếm ngữ pháp"
            className="border-none px-1 text-3xl focus-visible:ring-transparent"
          />
          {lexemeHanViet}
          {lexemeVocabs.length ||
            (lexemeGrammars.length > 0 && (
              <div className="w-full h-px bg-muted-foreground "></div>
            ))}
          <div className="flex flex-col gap-6 overflow-auto h-[220px] items-start mt-3">
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
  );
}
