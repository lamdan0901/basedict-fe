import { LoginPrompt } from "@/components/AuthWrapper/LoginPrompt";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { HistoryItemType } from "@/constants";
import { useDebounceFn } from "@/hooks/useDebounce";
import { useUrlSearchParams } from "@/hooks/useUrlSearchParams";
import {
  cn,
  getCookie,
  setCookie,
  stringifyParams,
  trimAllSpaces,
} from "@/lib";
import {
  MAX_CHARS_LENGTH,
  MAX_PARAGRAPH_TRANS_TIMES,
  PARAGRAPH_MIN_LENGTH,
  PARAGRAPH_TRANS_COUNT_KEY,
} from "@/modules/home/const";
import { setExpireDate } from "@/modules/home/utils";
import { getRequest } from "@/service/data";
import { useAppStore } from "@/store/useAppStore";
import { useHistoryStore } from "@/store/useHistoryStore";
import { useLexemeStore } from "@/store/useLexemeStore";
import { Pencil, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  forwardRef,
  KeyboardEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import useSWRImmutable from "swr/immutable";
import { TriggerWithOptionsArgs } from "swr/mutation";
import { v4 as uuid } from "uuid";

type Props = {
  initialText: string | undefined;
  lexemeSearch: TLexeme | undefined;
  onInputClear: () => void;
  onClearInitialText: () => void;
  translateParagraph: TriggerWithOptionsArgs<
    TTranslatedParagraph,
    any,
    "/v1/paragraphs/translate",
    { text: string }
  >;
};

type ForwardedRefProps = {
  hideSuggestions: () => void;
  translateParagraph(): Promise<void>;
};

export const LexemeSearch = forwardRef<ForwardedRefProps, Props>(
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
      isTranslatingParagraph,
      setIsTranslatingParagraph,
    } = useLexemeStore();
    const addHistoryItem = useHistoryStore((state) => state.addHistoryItem);
    const profile = useAppStore((state) => state.profile?.id);

    const setSearchParam = useUrlSearchParams();
    const searchParams = useSearchParams();
    const search = searchParams.get("search") ?? "";
    const seoSearch = searchParams.get("word") ?? "";

    const abortControllerRef = useRef<AbortController | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const initTextSet = useRef(false);
    const cancelSuggestionRef = useRef(false);

    const [loginPromptOpen, setLoginPromptOpen] = useState(false);
    const [lexemeSearchParam, setLexemeSearchParam] = useState(search);

    const isParagraphMode = text.length >= PARAGRAPH_MIN_LENGTH;
    const isVocabMode = !isParagraphMode && lexemeSearchParam;

    const {
      data: lexemeSuggestionRes,
      isLoading: loadingLexemeSuggestion,
      mutate: mutateLexemeVocab,
    } = useSWRImmutable<{
      data: TLexeme[];
    }>(
      isVocabMode && !initialText
        ? `/v1/lexemes?${stringifyParams({
            search: trimAllSpaces(lexemeSearchParam),
          })}`
        : null,
      (url: string) => {
        abortControllerRef.current = new AbortController();
        return getRequest(url, { signal: abortControllerRef.current.signal });
      }
    );

    const lexemeSuggestion = lexemeSuggestionRes?.data ?? [];
    const isDisplayingSuggestions = lexemeSuggestion.length > 0;

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
      if (cancelSuggestionRef.current) {
        cancelSuggestionRef.current = false;
        return;
      }
      setSearchParam({ search: value });
      setLexemeSearchParam(value);
    });

    function handleSearchTextChange(value: string) {
      if (value.length >= PARAGRAPH_MIN_LENGTH) {
        handleParagraphInputChange(value);
        return;
      }

      if (cancelSuggestionRef.current) cancelSuggestionRef.current = false;
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

    const handleTranslateParagraph = useCallback(
      async (e?: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e) {
          if (!(e.key === "Enter" && e.shiftKey && text)) return;
          e.preventDefault();
        }

        if (!profile) {
          setLoginPromptOpen(true);
          return;
        }

        setIsTranslatingParagraph(true);

        const useCount = Number(getCookie(PARAGRAPH_TRANS_COUNT_KEY) ?? 0);
        if (useCount === MAX_PARAGRAPH_TRANS_TIMES) {
          setTranslatedParagraph(null);
          return;
        }

        const data = await translateParagraph({ text });

        setCookie(PARAGRAPH_TRANS_COUNT_KEY, String(data.usedCount), {
          expires: setExpireDate(),
        });
        setTranslatedParagraph(data);
        addHistoryItem({
          rawParagraph: text,
          translatedParagraph: data.translated,
          uid: uuid(),
          type: HistoryItemType.Paragraph,
        });
      },
      [
        addHistoryItem,
        profile,
        setIsTranslatingParagraph,
        setTranslatedParagraph,
        text,
        translateParagraph,
      ]
    );

    function handleSearchLexeme(e: KeyboardEvent<HTMLTextAreaElement>) {
      if (!(e.key === "Enter" && text)) return;
      e.preventDefault();

      setWord(text);

      // Make sure that the hanviet/hiragana section always sync with lexeme search
      if (selectedVocab) setSelectedVocab(null);

      // when user press Enter, we need to cancel the request to get suggestion list
      cancelSuggestionRef.current = true;
      abortControllerRef.current?.abort();
      setLexemeSearchParam("");
      setVocabMeaningErrMsg("");
    }

    function handleVocabClick(lexeme: TLexeme) {
      setSelectedVocab(lexeme);
      setSearchParam({ search: lexeme.standard });
      setLexemeSearchParam("");
      mutateLexemeVocab({ data: [] });
      setText(lexeme.standard);
      setWord(lexeme.lexeme);
    }

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
        setSelectedVocab(null);
      } else {
        setTranslatedParagraph(null);
      }
    }, [
      isParagraphMode,
      setSearchParam,
      setTranslatedParagraph,
      setSelectedVocab,
      setWord,
    ]);

    const adjustTextareaHeight = useCallback(() => {
      if (!isParagraphMode) return;

      const textarea = textareaRef.current;
      if (textarea) {
        // Using both lines ensures that the textarea's height is accurately calculated each time, even when the content becomes shorter.
        // If we only used the second line, the textarea might not shrink when content is removed.
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [isParagraphMode]);

    useEffect(adjustTextareaHeight, [adjustTextareaHeight, text]);

    useEffect(() => {
      window.addEventListener("resize", adjustTextareaHeight);
      return () => {
        window.removeEventListener("resize", adjustTextareaHeight);
      };
    }, [adjustTextareaHeight]);

    useImperativeHandle(
      ref,
      () => ({
        hideSuggestions: () => {
          if (isDisplayingSuggestions) mutateLexemeVocab({ data: [] });
          if (lexemeSearchParam) setLexemeSearchParam("");
        },
        translateParagraph: () => handleTranslateParagraph(),
      }),
      [
        isDisplayingSuggestions,
        lexemeSearchParam,
        handleTranslateParagraph,
        mutateLexemeVocab,
      ]
    );

    return (
      <Card id="top" className="relative rounded-2xl">
        <CardContent
          className={cn(
            "!p-4 h-fit !pr-8  sm:min-h-[328px]",
            isParagraphMode ? "min-h-0" : "",
            !text && "min-h-[225px]"
          )}
        >
          <div className="absolute flex flex-wrap items-center h-10 w-full justify-end sm:justify-between left-0 px-3 -top-9">
            <div
              className={cn(
                "text-muted-foreground hidden text-sm italic",
                isParagraphMode ? "sm:block" : ""
              )}
            >
              Nhấn Shift + Enter để dịch
            </div>
            <Button
              onClick={() => {
                setIsTranslatingParagraph(false);
                setTimeout(() => {
                  textareaRef.current?.focus();
                });
              }}
              className={cn(
                "gap-1 px-0",
                isTranslatingParagraph ? "flex" : "hidden"
              )}
              variant={"link"}
            >
              <Pencil className="size-5" /> <span>Chỉnh sửa</span>
            </Button>
          </div>

          <Textarea
            id="paragraph-input"
            ref={textareaRef}
            autoFocus={!initialText}
            maxLength={MAX_CHARS_LENGTH}
            placeholder="Nhập text để tìm kiếm"
            className={cn(
              "border-none sm:placeholder:text-2xl placeholder:text-lg resize-none px-0 focus-visible:ring-transparent",
              isParagraphMode
                ? "h-full sm:min-h-[280px] text-xl"
                : "text-[26px] min-h-0 max-h-10 overflow-hidden sm:text-3xl",
              isTranslatingParagraph ? "hidden" : "block"
            )}
            onClick={() => {
              if (isParagraphMode) return;
              if (initialText) {
                onClearInitialText();
              }
            }}
            value={text || initialText}
            onChange={(e) =>
              isParagraphMode
                ? handleParagraphInputChange(e.target.value)
                : handleSearchTextChange(e.target.value)
            }
            onKeyDown={(e) =>
              isParagraphMode
                ? handleTranslateParagraph(e)
                : handleSearchLexeme(e)
            }
          />

          <p
            className={cn(
              "text-xl pt-2 h-full whitespace-pre-line",
              isTranslatingParagraph ? "block" : "hidden"
            )}
          >
            {text}
          </p>

          <Button
            variant={"ghost"}
            onClick={() => {
              handleSearchTextChange("");
            }}
            className={cn(
              "rounded-full px-2 absolute  right-1 top-4",
              isTranslatingParagraph ? "hidden" : text ? "flex" : "hidden"
            )}
          >
            <X />
          </Button>

          <div>{lexemeHanViet}</div>
          <div>{hiragana}</div>

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
              loadingLexemeSuggestion && " min-h-[137px]"
            )}
          >
            {loadingLexemeSuggestion
              ? "Đang tìm kiếm..."
              : lexemeSuggestion.map((lexeme) => {
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
            <div className="absolute right-3 bottom-1 text-muted-foreground text-base">
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
            bản. Khi bạn nhập quá 20 từ sẽ được coi là đoạn văn. Tối đa dài{" "}
            {MAX_CHARS_LENGTH} kí tự
          </p>

          <LoginPrompt
            open={loginPromptOpen}
            onOpenChange={setLoginPromptOpen}
          />
        </CardContent>
      </Card>
    );
  }
);
