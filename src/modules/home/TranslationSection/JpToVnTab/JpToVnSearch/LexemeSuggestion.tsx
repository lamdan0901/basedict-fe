import { Button } from "@/components/ui/button";

type Props = { lexemeSuggestion: TLexeme; onClick: () => void };

export function LexemeSuggestion({ lexemeSuggestion, onClick }: Props) {
  const { lexeme, standard, hanviet, hiragana, hiragana2 } = lexemeSuggestion;

  const lexemeStandard =
    standard === lexeme ? standard : `${standard} ${lexeme}`;
  const lexemeHiragana = hiragana
    ? `(${hiragana} ${hiragana2 ? "/ " + hiragana2 : ""})`
    : "";

  return (
    <Button
      onClick={onClick}
      className="items-center text-lg sm:text-xl py-7 font-normal relative px-1 w-full flex-col"
      variant="ghost"
    >
      <span>
        {lexemeStandard} {lexemeHiragana}
      </span>
      <span>{hanviet}</span>
      <div className="w-full h-px bg-muted-foreground absolute -bottom-2 left-0"></div>
    </Button>
  );
}
