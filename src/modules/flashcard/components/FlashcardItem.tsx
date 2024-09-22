import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DEFAULT_AVATAR_URL } from "@/constants";
import { cn } from "@/lib";
import { CheckCheck, GraduationCap, Clock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function FlashcardItem({
  card,
  hiddenDate,
  asHeading,
  flashCardNumber = 0,
}: {
  card: TFlashcardSet;
  hiddenDate?: boolean;
  asHeading?: boolean;
  flashCardNumber?: number;
}) {
  const router = useRouter();

  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={0}>
      <Card
        className={
          asHeading
            ? "border-2"
            : "cursor-pointer hover:border-b-[#8b0000] border-b-4 transition duration-300 "
        }
        onClick={() => {
          !asHeading && router.push(`/flashcard/${card.id}`);
        }}
      >
        <CardContent
          className={cn("p-2 flex flex-col justify-between h-full sm:p-4")}
        >
          <div>
            <div className="flex justify-between items-center gap-2">
              <h2 className="font-semibold truncate text-lg">{card.title}</h2>
              <div className="bg-[#8b0000] text-white shrink-0 rounded-full px-6 text-sm">
                {card.flashCardNumber ?? flashCardNumber} thẻ
              </div>
            </div>
            <p
              className={cn(
                "text-xs mt-2 mb-3 whitespace-pre-line",
                !asHeading && "line-clamp-2"
              )}
            >
              {card.description}
            </p>
          </div>

          <div className="flex justify-between gap-2 flex-wrap">
            {card.owner && (
              <Button
                className=" hover:text-[#8b0000] gap-2 px-2 py-1 -ml-2 items-center"
                variant={"ghost"}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/flashcard/user/${card.owner?.id}`);
                }}
              >
                <Image
                  src={card.owner.avatar || DEFAULT_AVATAR_URL}
                  width={40}
                  height={40}
                  className="rounded-full size-10 object-cover shrink-0"
                  alt="owner-avatar"
                />
                <span>{card.owner.name}</span>
              </Button>
            )}
            <div className="flex gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex gap-1 items-center text-xs">
                    <GraduationCap className="size-5" />
                    <span>{card.learningNumber} người</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Số người đang học</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex gap-1 items-center text-xs">
                    <CheckCheck className="size-5" />
                    <span>{card.learnedNumber} lượt</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Số người đã học</TooltipContent>
              </Tooltip>
              {!hiddenDate && (
                <div className="flex gap-1 items-center text-xs">
                  <Clock className="size-5" />
                  <span>{new Date(card.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
