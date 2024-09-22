import { Badge } from "@/components/ui/badge";
import { MouseEvent } from "react";

type Props = {
  similars?: string[];
  onWordClick?(lexeme: string, e: MouseEvent<HTMLDivElement>): void;
};

export function SimilarLexemes({ similars = [], onWordClick }: Props) {
  return (
    <div className="flex gap-2 px-4 h-fit flex-wrap">
      <p className="text-base sm:text-lg">Từ tương tự:</p>
      {similars.map((word, i) => (
        <Badge
          className="cursor-pointer text-sm sm:text-base"
          onClick={(e) => onWordClick?.(word, e)}
          key={i}
        >
          {word}
        </Badge>
      ))}
    </div>
  );
}
