import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useQueryParam } from "@/hooks/useQueryParam";
import { cn } from "@/lib";
import { useVnToJpTransStore } from "@/store/useVnToJpTransStore";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

type Props = {
  onTranslateJPToVN: () => Promise<void> | undefined;
};

export function VietnameseSearch({ onTranslateJPToVN }: Props) {
  const [searchParam, setSearchParam] = useQueryParam("searchVietnamese", "");
  const { searchText, setSearchText } = useVnToJpTransStore();
  const initTextSet = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initially fill input text with search param
  useEffect(() => {
    if (searchParam && !searchText && !initTextSet.current) {
      setSearchText(searchParam);
    }
    initTextSet.current = true;
  }, [searchParam, searchText, setSearchText]);

  return (
    <Card className="relative rounded-2xl">
      <CardContent
        className={cn(
          "!p-4 h-fit !pr-8 sm:min-h-[328px]"
          // !text && "min-h-[225px]"
        )}
      >
        <Textarea
          autoFocus
          ref={textareaRef}
          maxLength={20}
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              setSearchParam(e.currentTarget.value);
              if (searchText.trim()) onTranslateJPToVN();
            }
          }}
          className={cn(
            "border-none sm:placeholder:text-2xl placeholder:text-lg resize-none p-0 focus-visible:ring-transparent",
            // isParagraphMode
            //   ? "h-full sm:min-h-[248px] text-xl"   :
            "text-[26px] min-h-0 max-h-10 overflow-hidden sm:text-3xl"
          )}
          placeholder="Nhập text để tìm kiếm"
        />

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
            searchText ? "flex" : "hidden"
          )}
        >
          <X />
        </Button>
      </CardContent>
    </Card>
  );
}
