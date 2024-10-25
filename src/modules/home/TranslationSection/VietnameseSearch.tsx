import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useDebounceFn } from "@/hooks/useDebounce";
import { useQueryParam } from "@/hooks/useQueryParam";
import { cn } from "@/lib";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  onTranslateJPToVN: () => Promise<void> | undefined;
};

export function VietnameseSearch({ onTranslateJPToVN }: Props) {
  const [searchParam, setSearchParam] = useQueryParam("searchVietnamese", "");
  const [searchText, setSearchText] = useState("");
  const initTextSet = useRef(false);

  const debouncedSearch = useDebounceFn((value: string) => {
    setSearchParam(value);
  });

  function handleSearchTextChange(text: string) {
    setSearchText(text);
    debouncedSearch(text);
  }

  // Initially fill input text with search param
  useEffect(() => {
    if (searchParam && !searchText && !initTextSet.current) {
      setSearchText(searchParam);
    }
    initTextSet.current = true;
  }, [searchParam, searchText]);

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
          value={searchText}
          onChange={(e) => {
            handleSearchTextChange(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) e.preventDefault();
            if (e.key === "Enter" && !searchText.trim()) return;
            onTranslateJPToVN();
          }}
          className={cn(
            "border-none sm:placeholder:text-2xl placeholder:text-lg resize-none px-0 focus-visible:ring-transparent",
            // isParagraphMode
            //   ? "h-full sm:min-h-[248px] text-xl"   :
            "text-[26px] min-h-0 max-h-10 overflow-hidden sm:text-3xl"
          )}
          placeholder="Nhập text để tìm kiếm"
        />

        <Button
          variant={"ghost"}
          onClick={() => {
            handleSearchTextChange("");
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
