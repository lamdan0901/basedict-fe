import { Badge } from "@/components/ui/badge";

export function SimilarWords({
  lexeme,
  onClick,
}: {
  lexeme: TLexeme | undefined | null;
  onClick(word: string): void;
}) {
  if (!lexeme) return null;
  return (
    <div className="flex mx-4 gap-2 mt-4 absolute top-[100%] left-0 flex-wrap">
      <p className="text-lg">Từ tương tự:</p>
      {lexeme?.similars?.map((word, i) => (
        <Badge
          className="cursor-pointer text-base"
          onClick={() => onClick(word)}
          key={i}
        >
          {word}
        </Badge>
      ))}
    </div>
  );
}
