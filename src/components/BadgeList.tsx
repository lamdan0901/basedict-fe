import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib";
import { HTMLAttributes, MouseEvent } from "react";

type Props = {
  words?: string[];
  title?: string;
  isLoading?: boolean;
  onWordClick?(word: string, e: MouseEvent<HTMLDivElement>): void;
  titleClassName?: HTMLAttributes<HTMLParagraphElement>["className"];
  className?: HTMLAttributes<HTMLDivElement>["className"];
};

export function BadgeList({
  title,
  titleClassName,
  className,
  isLoading,
  words = [],
  onWordClick,
}: Props) {
  return (
    <div className={cn("flex gap-2 px-4 h-fit flex-wrap", className)}>
      <p className={cn("text-base sm:text-lg", titleClassName)}>{title}</p>
      {isLoading ? (
        <span>Đang tải...</span>
      ) : (
        words.map((word, i) => (
          <Badge
            className="cursor-pointer text-sm sm:text-base"
            onClick={(e) => onWordClick?.(word, e)}
            key={i}
          >
            {word}
          </Badge>
        ))
      )}
      {!isLoading && words?.length === 0 && "Chưa có tag nào"}
    </div>
  );
}
