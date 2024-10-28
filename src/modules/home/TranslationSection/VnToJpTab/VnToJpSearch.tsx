import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useQueryParam } from "@/hooks/useQueryParam";
import { cn } from "@/lib";
import { MAX_CHARS_LENGTH, PARAGRAPH_MIN_LENGTH } from "@/modules/home/const";
import { ParagraphControls } from "@/modules/home/TranslationSection/components/ParagraphControls";
import { TranslationTips } from "@/modules/home/TranslationSection/components/TranslationTips";
import { useVnToJpTransStore } from "@/store/useVnToJpTransStore";
import { X } from "lucide-react";
import { KeyboardEvent, useEffect, useRef } from "react";

type Props = {
  onTranslateWordVnToJp: () => Promise<void> | undefined;
  onTranslateParagraphVnToJp: () => Promise<void> | undefined;
};

export function VnToJpSearch({
  onTranslateWordVnToJp,
  onTranslateParagraphVnToJp,
}: Props) {
  const [searchParam, setSearchParam] = useQueryParam("searchVietnamese", "");
  const {
    searchText,
    isTranslatingParagraph,
    setSearchText,
    setIsTranslatingParagraph,
  } = useVnToJpTransStore();
  const initTextSet = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isParagraphMode = searchText.length >= PARAGRAPH_MIN_LENGTH;

  function handleTranslateWord(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter") {
      e.preventDefault();

      const input = e.currentTarget.value;
      setSearchParam(input);
      if (input.trim()) onTranslateWordVnToJp();
    }
  }

  function handleTranslateParagraph(e: KeyboardEvent<HTMLTextAreaElement>) {
    const input = e.currentTarget.value;
    if (!(e.key === "Enter" && e.shiftKey && input)) return;
    e.preventDefault();

    setSearchParam(input);
    if (input.trim()) {
      console.log("onTranslateParagraphVnToJp: ", onTranslateParagraphVnToJp);
      onTranslateParagraphVnToJp();
    }
  }

  // Initially fill input text with search param
  useEffect(() => {
    if (searchParam && !searchText && !initTextSet.current) {
      setSearchText(searchParam);
    }
    initTextSet.current = true;
  }, [searchParam, searchText, setSearchText]);

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
            !searchText && "min-h-[225px]"
          )}
        >
          <Textarea
            autoFocus
            ref={textareaRef}
            maxLength={MAX_CHARS_LENGTH}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            onKeyDown={
              isParagraphMode ? handleTranslateParagraph : handleTranslateWord
            }
            className={cn(
              "border-none sm:placeholder:text-2xl placeholder:text-lg resize-none p-0 focus-visible:ring-transparent",
              isParagraphMode
                ? "h-full sm:min-h-[280px] text-xl"
                : "text-[26px] min-h-0 max-h-10 overflow-hidden sm:text-3xl",
              isTranslatingParagraph ? "hidden" : "block"
            )}
            placeholder="Nhập text để tìm kiếm"
          />

          <p
            className={cn(
              "text-xl h-full whitespace-pre-line",
              isTranslatingParagraph ? "block" : "hidden"
            )}
          >
            {searchText}
          </p>

          <Button
            variant={"ghost"}
            onClick={() => {
              setSearchText("");
              setSearchParam("");
              setTimeout(() => {
                textareaRef.current?.focus();
              });
            }}
            className={cn(
              "rounded-full px-2 absolute  right-1 top-4",
              isTranslatingParagraph ? "hidden" : searchText ? "flex" : "hidden"
            )}
          >
            <X />
          </Button>

          <TranslationTips hidden={!!searchText} />
        </CardContent>
      </Card>
    </div>
  );
}
