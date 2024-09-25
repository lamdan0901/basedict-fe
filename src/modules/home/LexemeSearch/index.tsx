import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUrlSearchParams } from "@/hooks/useUrlSearchParams";
import { cn, stringifyParams, trimAllSpaces } from "@/lib";
import { getRequest } from "@/service/data";
import {
  useState,
  KeyboardEvent,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import useSWRImmutable from "swr/immutable";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { v4 as uuid } from "uuid";
import { useDebounceFn } from "@/hooks/useDebounce";

type LexemeSearchProps = {
  initialText: string | undefined;
  lexemeSearch: TLexeme | undefined;
  onInputClear: () => void;
  onClearInitialText: () => void;
  translateParagraph: TriggerWithOptionsArgs<
    string,
    any,
    "/v1/paragraphs/translate",
    { text: string }
  >;
};

export const LexemeSearch = forwardRef<
  { hideSuggestions: () => void },
  LexemeSearchProps
>(
  (
    {
      lexemeSearch,
      initialText,
      onInputClear,
      onClearInitialText,
      translateParagraph,
    },
    ref
  ) => {
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
    const seoSearch = searchParams.get("word") ?? "";
    const [readyToSearch, setReadyToSearch] = useState(false);
    const [lexemeSearchParam, setLexemeSearchParam] = useState(search);
    const isParagraphMode = text.length >= PARAGRAPH_MIN_LENGTH;
    const isVocabMode =
      !isParagraphMode &&
      lexemeSearchParam &&
      !lexemeSearchParam.startsWith(GRAMMAR_CHAR);

    const {
      data: lexemeVocabRes,
      isLoading: loadingLexemeVocab,
      mutate: mutateLexemeVocab,
    } = useSWRImmutable<{
      data: TLexeme[];
    }>(
      isVocabMode && !initialText
        ? `/v1/lexemes?${stringifyParams({
            search: trimAllSpaces(lexemeSearchParam),
          })}`
        : null,
      getRequest
    );

    const lexemeVocabs = lexemeVocabRes?.data ?? [];
    const isDisplayingSuggestions = lexemeVocabs.length > 0;

    const lexemeToShowHanviet = selectedVocab ?? lexemeSearch;
    const hanviet = lexemeToShowHanviet?.hanviet
      ? "(" + lexemeToShowHanviet.hanviet + ")"
      : "";
    const lexemeHanViet = lexemeToShowHanviet
      ? `${
          text !== lexemeToShowHanviet.lexeme ? lexemeToShowHanviet.lexeme : ""
        } ${hanviet}`
      : "";
    const hiragana = lexemeToShowHanviet
      ? `${lexemeToShowHanviet.hiragana} ${
          lexemeToShowHanviet.hiragana2
            ? "/ " + lexemeToShowHanviet.hiragana2
            : ""
        }`
      : "";

    const debouncedSearch = useDebounceFn((value: string) => {
      setSearchParam({ search: value });
      setLexemeSearchParam(value);
    });

    function handleSearchTextChange(value: string) {
      if (value.length >= PARAGRAPH_MIN_LENGTH) {
        handleParagraphInputChange(value);
        return;
      }

      setText(value);
      debouncedSearch(value);

      if (value.trim().length === 0) {
        mutateLexemeVocab({ data: [] });
        setWord("");
        setSelectedGrammar(null);
        setSelectedVocab(null);
        onInputClear();
      }
    }

    function handleParagraphInputChange(value: string) {
      if (value.length < PARAGRAPH_MIN_LENGTH) {
        handleSearchTextChange(value);
        return;
      }
      if (search && isParagraphMode) {
        setSearchParam({ search: "" });
        setLexemeSearchParam("");
      }
      setText(value);
    }

    async function handleTranslateGrammar(
      e: KeyboardEvent<HTMLTextAreaElement>
    ) {
      if (e.key === "Enter" && !e.shiftKey && text) {
        e.preventDefault();
        const data = await translateParagraph({ text });
        setTranslatedParagraph(data);
        addHistoryItem({
          rawParagraph: text,
          translatedParagraph: data,
          uid: uuid(),
          type: HistoryItemType.Paragraph,
        });
      }
    }

    function handleSearchLexeme(e: KeyboardEvent<HTMLInputElement>) {
      if (!(e.key === "Enter" && text)) return;

      // when user press Enter, we need to cancel the request to get vocab list
      setLexemeSearchParam("");

      if (isVocabMode) {
        setWord(text);
        setVocabMeaningErrMsg("");
        mutateLexemeVocab({ data: [] });
      }
    }

    function handleVocabClick(lexeme: TLexeme) {
      setSelectedVocab(lexeme);
      setSearchParam({ search: lexeme.standard });
      setLexemeSearchParam("");
      mutateLexemeVocab({ data: [] });
      setText(lexeme.standard);
      setWord(lexeme.lexeme);
    }

    // After user select a lexeme from the list, user can click on that word again to search for similar ones
    useEffect(() => {
      if (readyToSearch) {
        setSearchParam({ search: text, word: null });
        setLexemeSearchParam(text);
        setReadyToSearch(false);
      }
    }, [setSearchParam, text, readyToSearch]);

    // Initially fill input text with search param
    useEffect(() => {
      if ((search || seoSearch) && !text && !initTextSet.current) {
        setText(search || seoSearch);
      }
      initTextSet.current = true;
    }, [search, seoSearch, setText, text]);

    useEffect(() => {
      if (isParagraphMode) {
        setSearchParam({ search: "" });
        setLexemeSearchParam("");
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

    useImperativeHandle(
      ref,
      () => ({
        hideSuggestions: () => {
          if (isDisplayingSuggestions) mutateLexemeVocab({ data: [] });
          if (lexemeSearchParam) setLexemeSearchParam("");
        },
      }),
      [isDisplayingSuggestions, lexemeSearchParam, mutateLexemeVocab]
    );

    return (
      <Card id="top" className="rounded-2xl">
        <CardContent
          className={cn(
            "!p-4 h-fit !pr-8 relative ",
            isParagraphMode ? "min-h-0 sm:min-h-[328px]" : " sm:min-h-[328px]",
            !text && "min-h-[225px]"
          )}
        >
          <Input
            id="lexeme-search"
            value={text || initialText}
            autoFocus={!initialText}
            onChange={(e) => handleSearchTextChange(e.target.value)}
            onClick={() => {
              if (initialText) {
                onClearInitialText();
              }
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
          <div> {hiragana}</div>

          {isDisplayingSuggestions && (
            <div className="w-full h-px bg-muted-foreground"></div>
          )}

          <div
            className={cn(
              "flex flex-col gap-6 overflow-auto items-start mt-3",
              isParagraphMode
                ? "h-auto"
                : lexemeHanViet && hiragana
                ? "sm:h-[195px] h-[137px]"
                : "sm:h-[220px] h-[137px]",
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
                  const hiragana = lexeme.hiragana
                    ? `(${lexeme.hiragana} ${
                        lexeme.hiragana2 ? "/ " + lexeme.hiragana2 : ""
                      })`
                    : "";

                  return (
                    <Button
                      key={lexeme.id}
                      onClick={() => handleVocabClick(lexeme)}
                      className="items-center text-lg sm:text-xl py-7 font-normal relative px-1 w-full flex-col"
                      variant="ghost"
                    >
                      <span>
                        {lexemeStandard} {hiragana}
                      </span>
                      <span>{lexeme.hanviet}</span>
                      <div className="w-full h-px bg-muted-foreground absolute -bottom-2 left-0"></div>
                    </Button>
                  );
                })}
          </div>

          {isParagraphMode && (
            <div className="absolute right-8 bottom-1 text-muted-foreground text-base">
              {text.length}/{MAX_CHARS_LENGTH}
            </div>
          )}

          <p
            className={cn(
              "absolute sm:top-1/2 top-[60%] left-5 w-[90%] sm:text-base text-sm text-muted-foreground -translate-y-1/2 pointer-events-none",
              text || initialText ? "hidden" : "block"
            )}
          >
            Tips: <br />
            - Hãy nhập từ vựng theo thể từ điển. Tối đa 7 kí tự, và chỉ bao gồm
            chữ hán, hiragana hoặc katakana <br /> - Bạn có thể dịch 1 đoạn văn
            bản. Khi bạn nhập quá 20 từ sẽ được coi là đoạn văn. Tối đa dài 500
            kí tự
          </p>
        </CardContent>
      </Card>
    );
  }
);
