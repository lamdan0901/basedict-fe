import { Button } from "@/components/ui/button";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TipsPopup } from "@/shared/ui";
import { useVnToJpMeaningStore } from "@/features/translation/entities/ui/vn-to-jp-tab/vn-to-jp-meaning-section/store";
import { CircleCheckBig } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  lexemeToSearch: string;
  rawTranslatedLexemes: string[];
  lexemeSearch: TLexeme | undefined;
  onLexemeSelect: (lexeme: string) => void;
};

export function MeaningInPreview({
  lexemeToSearch,
  rawTranslatedLexemes,
  lexemeSearch,
  onLexemeSelect,
}: Props) {
  const { lexeme, standard, approved, hanviet, hiragana, hiragana2 } =
    lexemeSearch ?? {};
  const { canShowMeaningTips, hideMeaningTips } = useVnToJpMeaningStore();

  const [shouldShowMeaningTips, toggleMeaningTips] = useState(false);
  const [meaningSelectorOpen, setMeaningSelectorOpen] = useState(false);

  useEffect(() => {
    if (canShowMeaningTips && rawTranslatedLexemes.length >= 2) {
      toggleMeaningTips(true);
    }
  }, [canShowMeaningTips, rawTranslatedLexemes.length]);

  return (
    <div className="flex gap-2 flex-wrap items-center">
      <Popover open={meaningSelectorOpen} onOpenChange={setMeaningSelectorOpen}>
        <PopoverTrigger asChild>
          <Button
            className="sm:text-3xl whitespace-pre-wrap text-start text-2xl px-1"
            variant={"ghost"}
          >
            {lexemeToSearch}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit min-w-40 px-0">
          <Command className="p-0">
            <CommandList>
              {rawTranslatedLexemes?.map((lexeme, i) => (
                <CommandItem
                  key={i}
                  className="text-xl"
                  onSelect={() => {
                    setMeaningSelectorOpen(false);
                    onLexemeSelect(lexeme);
                  }}
                >
                  {lexeme}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {canShowMeaningTips && (
        <TipsPopup
          open={shouldShowMeaningTips}
          onOpenChange={toggleMeaningTips}
          tipTitle="Tips: Bấm vào nghĩa của từ để xem các nghĩa khác"
          onHideTips={() => setTimeout(() => hideMeaningTips(), 800)}
        />
      )}

      <div className="space-x-2 text-sm">
        {standard !== lexeme ? `(${lexeme})` : ""}
        {hanviet && <span>({hanviet})</span>}
        {approved && (
          <CircleCheckBig className="text-green-500 shrink-0 w-4 h-4" />
        )}
        <span>{hiragana}</span>
        {hiragana2 && <span>/ {hiragana2}</span>}
      </div>
    </div>
  );
}
