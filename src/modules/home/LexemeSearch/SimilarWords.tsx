import { Badge } from "@/components/ui/badge";

export function SimilarWords({
  similars,
  onClick,
}: {
  similars: string[] | undefined | null;
  onClick(word: string): void;
}) {
  if (!similars?.length) return null;
  return (
    <div className="flex gap-2 sm:max-w-[50%] flex-wrap">
      <p className="text-base sm:text-lg">Từ tương tự:</p>
      {similars?.map((word, i) => (
        <Badge
          className="cursor-pointer text-sm sm:text-base"
          onClick={() => onClick(word)}
          key={i}
        >
          {word}
        </Badge>
      ))}
    </div>
  );
}
