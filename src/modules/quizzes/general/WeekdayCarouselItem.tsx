import { TDateWithExamRes } from "@/modules/quizzes/general/utils";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, Check, Star, X } from "lucide-react";
import { CarouselItem } from "@/components/ui/carousel";
import { cn } from "@/lib";
import { weekdayMap } from "@/modules/quizzes/const";

type Props = {
  d: TDateWithExamRes;
  formattedToday: string;
  canJoinWeekendTest: boolean;
  onShowHistory(): void;
  onShowAlert(): void;
};

export function WeekdayCarouselItem({
  d,
  formattedToday,
  canJoinWeekendTest,
  onShowHistory,
  onShowAlert,
}: Props) {
  const isDayPassed = d.date < formattedToday;
  const isToday = d.date === formattedToday;
  const isSat = d.weekday === "Sat";
  const isSun = d.weekday === "Sun";
  const isSunOfThisWeek = isSun && d.date >= formattedToday;
  const isDoneTest = !!d.createdAt;

  return (
    <CarouselItem
      onClick={() => {
        if (isDoneTest) {
          onShowHistory();
        } else if (isToday) {
          onShowAlert();
        }
      }}
      className="md:my-3 mx-2 md:mx-0 basis-[14.25%]"
    >
      <Card
        className={cn(
          (isToday || isDoneTest) && "cursor-pointer hover:shadow-sm",
          isToday && "bg-yellow-100",
          isDoneTest && "bg-lime-200"
        )}
      >
        <CardContent className="flex md:flex-col relative md:aspect-[3/4] gap-2 items-center justify-center p-2">
          {isDoneTest ? (
            <BadgeCheck className="size-10 text-lime-700  bg-white rounded-full p-1" />
          ) : isSun ? (
            <Star
              className={cn(
                "size-10 rounded-full p-1",
                canJoinWeekendTest && isSunOfThisWeek
                  ? "bg-lime-700 text-white "
                  : "bg-muted text-black"
              )}
            />
          ) : isDayPassed ? (
            <X className="size-10  bg-muted rounded-full p-1" />
          ) : (
            <Check className="size-10  bg-muted rounded-full p-1" />
          )}
          <div className=" text-sm font-semibold">{weekdayMap[d.weekday]}</div>
          <div className=" text-sm">{d.day}</div>
          {isSat && (
            <div className="absolute text-sm -top-2 size-7 py-1 text-center -right-2 rounded-full text-white bg-destructive">
              2X
            </div>
          )}
        </CardContent>
      </Card>
    </CarouselItem>
  );
}

{
  /* <CarouselItem className="sm:basis-1/4 basis-1/3 my-3  md:basis-1/5 lg:basis-[14.25%]">
            <Card className="bg-destructive">
              <CardContent className="flex flex-col  text-white aspect-[3/4] items-center justify-center p-2">
                <Star className="size-10 bg-yellow-300 rounded-full p-1 mb-2" />
                <div className=" text-sm font-semibold">Lên hạng</div>
              </CardContent>
            </Card>
          </CarouselItem>  */
}
