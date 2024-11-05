import { Card, CardContent } from "@/components/ui/card";
import { DEFAULT_AVATAR_URL } from "@/constants";
import { CheckCheck, GraduationCap } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function QuizCreator({ creator }: { creator: TQuizCreator }) {
  const router = useRouter();

  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={0}>
      <Card className="cursor-pointer hover:border-b-[#8b0000] border-b-4 transition duration-300">
        <CardContent
          onClick={() => router.push(`/quizzes/user/${creator.id}`)}
          className="p-2 space-y-4 sm:p-4"
        >
          <div className="flex items-center gap-2">
            <Image
              src={creator.avatar || DEFAULT_AVATAR_URL}
              width={40}
              height={40}
              className="rounded-full size-10 object-cover shrink-0"
              alt="owner-avatar"
            />
            <span className="truncate font-semibold">{creator.name}</span>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex gap-1 items-center text-xs">
                  <GraduationCap className="size-5" />
                  <span>{creator.totalLearningNumber} người</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Số người đang làm</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex gap-1 items-center text-xs">
                  <CheckCheck className="size-5" />
                  <span>{creator.totalLearnedNumber} lượt</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Số người đã làm</TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
