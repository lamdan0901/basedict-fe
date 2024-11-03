import { CardIcon } from "@/components/icons";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DEFAULT_AVATAR_URL } from "@/constants";
import { CheckCheck, GraduationCap } from "lucide-react";
import Image from "next/image";

type Props = {
  avatar?: string;
  name?: string;
  totalSet: number;
  totalLearningNumber?: number;
  totalLearnedNumber?: number;
};

export function UserFlashcardSetHeader({
  avatar,
  name,
  totalSet,
  totalLearningNumber,
  totalLearnedNumber,
}: Props) {
  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={0}>
      <div className="flex pb-4 border-b border-muted-foreground items-center gap-4">
        <Image
          src={avatar || DEFAULT_AVATAR_URL}
          width={80}
          height={80}
          className="rounded-full size-20 object-cover shrink-0"
          alt="owner-avatar"
        />
        <div className="space-y-4">
          <span className="text-lg font-semibold">{name}</span>
          <div className="flex flex-wrap gap-2">
            <div className="bg-slate-50 gap-1 flex rounded-full px-2 text-sm border">
              <CardIcon width={20} height={20} /> {totalSet} bộ flashcard
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-slate-50 gap-1 flex rounded-full px-2 text-sm border">
                  <GraduationCap className="size-5" />
                  <span>{totalLearningNumber} người</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Số người đang học</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-slate-50 gap-1 flex rounded-full px-2 text-sm border">
                  <CheckCheck className="size-5" />
                  <span>{totalLearnedNumber} lượt</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Số người đã học</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
