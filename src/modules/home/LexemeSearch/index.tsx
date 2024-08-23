import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUrlSearchParams } from "@/hooks/useUrlSearchParams";
import { cn, stringifyParams, trimAllSpaces } from "@/lib";
import { getRequest } from "@/service/data";
import { useState, KeyboardEvent, useEffect, useRef } from "react";
import useSWRImmutable from "swr/immutable";
import { useSearchParams } from "next/navigation";
import { useLexemeStore } from "@/store/useLexemeStore";
import {
  GRAMMAR_CHAR,
  PARAGRAPH_MIN_LENGTH,
  MAX_CHARS_LENGTH,
  HistoryItemType,
} from "@/constants";
import { Textarea } from "@/components/ui/textarea";
import { TriggerWithOptionsArgs } from "swr/mutation";
import { X } from "lucide-react";
import { useHistoryStore } from "@/store/useHistoryStore";

type LexemeSearchProps = {
  lexemeSearch: TLexeme | undefined;
  translateParagraph: TriggerWithOptionsArgs<
    string,
    any,
    "/v1/paragraphs/translate",
    { text: string }
  >;
};

export function LexemeSearch({
  lexemeSearch,
  translateParagraph,
}: LexemeSearchProps) {
  const {
    text,
    setText,
    selectedVocab,
    setSelectedVocab,
    setVocabMeaningErrMsg,
    setSelectedGrammar,
    setWord,
    setTranslatedParagraph,
  } = useLexemeStore();
  const { addHistoryItem } = useHistoryStore();

  const initTextSet = useRef(false);
  const setSearchParam = useUrlSearchParams();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const [readyToSearch, setReadyToSearch] = useState(false);

  const isParagraphMode = text.length >= PARAGRAPH_MIN_LENGTH;
  const isVocabMode =
    !isParagraphMode && search && !search.startsWith(GRAMMAR_CHAR);
  const isGrammarMode = false; // temporarily disabled feature
  // !isParagraphMode && search.length > 1 && search.startsWith(GRAMMAR_CHAR);

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
  const { data: lexemeGrammarRes, isLoading: loadingLexemeGrammar } =
    useSWRImmutable<{
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

  function handleSearchTextChange(value: string) {
    if (value.length >= PARAGRAPH_MIN_LENGTH) {
      handleParagraphInputChange(value);
      return;
    }

    setText(value);
    setSearchParam({ search: value });

    if (value.trim().length === 0) {
      setSearchParam({ search: "" });
      mutateLexemeVocab({ data: [] });
      setWord("");
      setSelectedGrammar(null);
      setSelectedVocab(null);
    }
  }

  function handleParagraphInputChange(value: string) {
    if (value.length < PARAGRAPH_MIN_LENGTH) {
      handleSearchTextChange(value);
      return;
    }
    if (search && isParagraphMode) setSearchParam({ search: "" });
    setText(value);
  }

  async function handleTranslateGrammar(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && text) {
      e.preventDefault();
      const data = await translateParagraph({ text });
      setTranslatedParagraph(data);
      addHistoryItem({
        rawParagraph: text,
        translatedParagraph: data,
        uid: crypto.randomUUID(),
        type: HistoryItemType.Paragraph,
      });
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
    } else if (lexemeGrammars.length > 0) {
      setSelectedGrammar(lexemeGrammars[0]);
      // setGrammarMeaningErrMsg("");
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
    addHistoryItem({
      ...grammar,
      uid: crypto.randomUUID(),
      type: HistoryItemType.Grammar,
    });
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

  useEffect(() => {
    if (isParagraphMode) {
      setSearchParam({ search: "" });
      setWord("");
      setSelectedGrammar(null);
      setSelectedVocab(null);
    }
  }, [
    isParagraphMode,
    setSearchParam,
    setSelectedGrammar,
    setSelectedVocab,
    setWord,
  ]);

  return (
    <Card className="rounded-2xl">
      <CardContent
        className={cn(
          "!p-4 h-fit !pr-8 relative ",
          isParagraphMode ? "min-h-0 sm:min-h-[328px]" : " sm:min-h-[328px]",
          !text && "min-h-[225px]"
        )}
      >
        <Input
          id="lexeme-search"
          value={text}
          autoFocus
          onChange={(e) => handleSearchTextChange(e.target.value)}
          onClick={() => {
            if (text && !readyToSearch) {
              setReadyToSearch(true);
            }
          }}
          onKeyDown={handleSearchLexeme}
          placeholder="Nhập text để tìm kiếm"
          className={cn(
            "border-none px-1 sm:placeholder:text-2xl placeholder:text-lg text-[26px] sm:text-3xl focus-visible:ring-transparent",
            isParagraphMode ? "hidden" : "block"
          )}
        />
        <Textarea
          id="paragraph-input"
          maxLength={MAX_CHARS_LENGTH}
          className={cn(
            "border-none resize-none h-full sm:min-h-[280px] px-1 text-xl focus-visible:ring-transparent",
            isParagraphMode ? "block" : "hidden"
          )}
          onChange={(e) => handleParagraphInputChange(e.target.value)}
          onKeyDown={handleTranslateGrammar}
          value={text}
        />
        <Button
          variant={"ghost"}
          onClick={() => {
            handleSearchTextChange("");
          }}
          className={cn(
            "rounded-full px-2 absolute  right-1 top-4",
            text ? "flex" : "hidden"
          )}
        >
          <X />
        </Button>

        <div> {lexemeHanViet}</div>

        {isDisplayingSuggestions && (
          <div className="w-full h-px bg-muted-foreground"></div>
        )}

        <div
          className={cn(
            "flex flex-col gap-6 overflow-auto items-start mt-3",
            isParagraphMode ? "h-auto" : "sm:h-[220px] h-[137px] ",
            !isParagraphMode && !isDisplayingSuggestions && "h-0",
            loadingLexemeVocab && " min-h-[137px]"
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
          {isGrammarMode &&
            !loadingLexemeGrammar &&
            lexemeGrammars.length === 0 && (
              <div className="text-lg">Không tìm thấy ngữ pháp</div>
            )}
        </div>

        {isParagraphMode && (
          <div className="absolute right-8 bottom-1 text-muted-foreground text-base">
            {text.length}/{MAX_CHARS_LENGTH}
          </div>
        )}

        <p
          className={cn(
            "absolute sm:top-1/2 top-[60%] left-5 w-[90%] sm:text-base text-sm text-muted-foreground -translate-y-1/2 pointer-events-none",
            text ? "hidden" : "block"
          )}
        >
          Tips: <br />
          1. Hãy nhập từ vựng theo thể từ điển. Tối đa 7 kí tự, và chỉ bao gồm
          chữ hán, hiragana hoặc katakana <br />
          {/* 2. Hãy nhập thêm dấu 〜 để tìm kiếm ngữ pháp <br /> */}
          2. Bạn có thể dịch 1 đoạn văn bản. Tối đa dài 500 kí tự
        </p>
      </CardContent>
    </Card>
  );
}
