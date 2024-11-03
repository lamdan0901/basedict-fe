import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useDebounceFn } from "@/hooks/useDebounce";
import { useUrlSearchParams } from "@/hooks/useUrlSearchParams";
import { cn, stringifyParams, trimAllSpaces } from "@/lib";
import { MAX_CHARS_LENGTH, PARAGRAPH_MIN_LENGTH } from "@/modules/home/const";
import { ParagraphControls } from "@/modules/home/TranslationSection/components/ParagraphControls";
import { TranslationTips } from "@/modules/home/TranslationSection/components/TranslationTips";
import { LexemeSuggestion } from "@/modules/home/TranslationSection/JpToVnTab/JpToVnSearch/LexemeSuggestion";
import { getRequest } from "@/service/data";
import { useLexemeStore } from "@/store/useLexemeStore";
import { X } from "lucide-react";
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

type Props = {
  initialText: string | undefined;
  lexemeSearch: TLexeme | undefined;
  onInputClear: () => void;
  onClearInitialText: () => void;
  onTranslateParagraph: () => void;
};

export type JpToVnSearchRef = {
  hideSuggestions: () => void;
};

export const JpToVnSearch = forwardRef<JpToVnSearchRef, Props>(
  (
    {
      lexemeSearch,
      initialText,
      onInputClear,
      onClearInitialText,
      onTranslateParagraph,
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

    const setSearchParam = useUrlSearchParams();
    const searchParams = useSearchParams();
    const search = searchParams.get("search") ?? "";
    const seoSearch = searchParams.get("word") ?? "";

    const abortControllerRef = useRef<AbortController | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const initTextSet = useRef(false);
    const cancelSuggestionRef = useRef(false);

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

    const lexemeSuggestions = lexemeSuggestionRes?.data ?? [];
    const isDisplayingSuggestions = lexemeSuggestions.length > 0;

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

    const handleTranslateParagraph = (
      e?: KeyboardEvent<HTMLTextAreaElement>
    ) => {
      if (!(e?.key === "Enter" && e?.shiftKey && text)) return;
      e?.preventDefault();

      onTranslateParagraph();
    };

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

    const fillInputWithSearchParam = useCallback(() => {
      if ((search || seoSearch) && !text && !initTextSet.current) {
        setText(search || seoSearch);
      }
      initTextSet.current = true;
    }, [search, seoSearch, setText, text]);

    const handleInputModeSwitch = useCallback(() => {
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

    useEffect(fillInputWithSearchParam, [fillInputWithSearchParam]);
    useEffect(handleInputModeSwitch, [handleInputModeSwitch]);

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
      }),
      [isDisplayingSuggestions, lexemeSearchParam, mutateLexemeVocab]
    );

    return (
      <div className="relative">
        <ParagraphControls
          show={isParagraphMode}
          showEditButton={isTranslatingParagraph}
          onEdit={() => {
            setIsTranslatingParagraph(false);
            setTimeout(() => {
              textareaRef.current?.focus();
            });
          }}
        />

        <Card className="relative rounded-2xl">
          <CardContent
            className={cn(
              "!p-4 h-fit !pr-8",
              isParagraphMode ? "min-h-0 sm:min-h-[328px]" : "sm:min-h-[328px]",
              !text && "min-h-[225px]"
            )}
          >
            <Textarea
              id="paragraph-input"
              ref={textareaRef}
              autoFocus={!initialText}
              maxLength={MAX_CHARS_LENGTH}
              placeholder="Nhập text để tìm kiếm"
              className={cn(
                "border-none sm:placeholder:text-2xl placeholder:text-lg resize-none p-0 focus-visible:ring-transparent",
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
                "text-xl h-full whitespace-pre-line",
                isTranslatingParagraph ? "block" : "hidden"
              )}
            >
              {text}
            </p>

            <Button
              variant={"ghost"}
              onClick={() => {
                handleSearchTextChange("");
                setTimeout(() => {
                  textareaRef.current?.focus();
                });
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
                : lexemeSuggestions.map((lexemeSuggestion) => (
                    <LexemeSuggestion
                      key={lexemeSuggestion.id}
                      onClick={() => handleVocabClick(lexemeSuggestion)}
                      lexemeSuggestion={lexemeSuggestion}
                    />
                  ))}
            </div>

            {isParagraphMode && (
              <div className="absolute right-3 bottom-1 text-muted-foreground text-base">
                {text.length}/{MAX_CHARS_LENGTH}
              </div>
            )}

            <TranslationTips hidden={!!(text || initialText)} />
          </CardContent>
        </Card>
      </div>
    );
  }
);
