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
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { HTMLAttributes } from "react";

export function QuizItem({
  quiz,
  hiddenDate,
  asHeading,
  quizNumber = 0,
  className,
}: {
  quiz: TQuiz;
  hiddenDate?: boolean;
  asHeading?: boolean;
  quizNumber?: number;
  className?: HTMLAttributes<HTMLDivElement>["className"];
}) {
  const router = useRouter();

  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={0}>
      <Card
        className={cn(
          asHeading
            ? "border-2"
            : "cursor-pointer hover:border-b-[#8b0000] border-b-4 transition duration-300 ",
          className
        )}
        onClick={() => {
          !asHeading && router.push(`/quizzes/${quiz.id}`);
        }}
      >
        <CardContent
          className={cn("p-2 flex flex-col justify-between h-full sm:p-4")}
        >
          <div>
            <div className="flex justify-between flex-wrap items-center gap-2">
              <h2 className="font-semibold truncate text-lg">{quiz.title}</h2>
              <div className="flex items-center gap-2">
                <div className="bg-[#8b0000] text-white shrink-0 rounded-full px-3 text-sm">
                  {quiz.jlptLevel}
                </div>
                <div className="bg-[#8b0000] text-white shrink-0 rounded-full px-3 text-sm">
                  {quiz.questionNumber ?? quizNumber} câu hỏi
                </div>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              {quiz.tags?.map((tag) => (
                <Link
                  href={`/quizzes/search?q=~%28search~%27*23${tag}%29`}
                  onClick={(e) => e.stopPropagation()}
                  key={tag}
                  className="italic hover:underline text-gray-700 hover:text-blue-500 text-xs"
                >
                  #{tag}
                </Link>
              ))}
            </div>
            <p
              className={cn(
                "text-xs mt-2 mb-3 whitespace-pre-line",
                !asHeading && "line-clamp-2"
              )}
            >
              {quiz.description}
            </p>
          </div>

          <div className="flex justify-between gap-2 flex-wrap">
            {quiz.owner && (
              <Button
                className="overflow-hidden hover:text-[#8b0000] gap-2 px-2 py-1 -ml-2 items-center"
                variant={"ghost"}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/quizzes/user/${quiz.owner?.id}`);
                }}
              >
                <Image
                  src={quiz.owner.avatar || DEFAULT_AVATAR_URL}
                  width={40}
                  height={40}
                  className="rounded-full size-10 object-cover shrink-0"
                  alt="owner-avatar"
                />
                <span className="truncate">{quiz.owner.name}</span>
              </Button>
            )}
            <div className="flex gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex gap-1 items-center text-xs">
                    <GraduationCap className="size-5" />
                    <span>{quiz.learningNumber} người</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Số người đang làm</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex gap-1 items-center text-xs">
                    <CheckCheck className="size-5" />
                    <span>{quiz.learnedNumber} lượt</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Số người đã làm</TooltipContent>
              </Tooltip>
              {!hiddenDate && (
                <div className="flex gap-1 items-center text-xs">
                  <Clock className="size-5" />
                  <span>{new Date(quiz.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
