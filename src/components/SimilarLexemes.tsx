import { Badge } from "@/components/ui/badge";

type Props = {
  similars?: string[];
  onWordClick?(word: string): void;
};

export function SimilarLexemes({ similars = [], onWordClick }: Props) {
  return (
    <div className="flex gap-2 px-4 h-fit flex-wrap">
      <p className="text-base sm:text-lg">Từ tương tự:</p>
      {similars.map((word, i) => (
        <Badge
          className="cursor-pointer text-sm sm:text-base"
          onClick={() => onWordClick?.(word)}
          key={i}
        >
          {word}
        </Badge>
      ))}
    </div>
  );
}
