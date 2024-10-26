import { Button } from "@/components/ui/button";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CircleCheckBig } from "lucide-react";
import { useState } from "react";

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
  const [meaningSelectorOpen, setMeaningSelectorOpen] = useState(false);
  const { lexeme, standard, approved, hanviet, hiragana, hiragana2 } =
    lexemeSearch ?? {};

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
