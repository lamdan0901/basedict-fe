import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { HistoryDialog } from "@/modules/quizzes/general/HistoryDialog";
import { BadgeCheck, Check, Star, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { cn } from "@/lib";
import { DAYS_PER_WEEK, MAX_POINT, weekdayMap } from "@/modules/quizzes/const";
import {
  generateDateRange,
  mergeDateRangeWithHistory,
  TDateWithExamRes,
} from "@/modules/quizzes/general/utils";

type Props = {
  currentSeason: TSeason | undefined;
  seasonHistory: TSeasonHistory[] | undefined;
  rankPoint: number | undefined;
};

const today = new Date();
const formattedToday = dayjs(today).format("YYYY-MM-DD");

export function WeekdayCarousel({
  currentSeason,
  seasonHistory = [],
  rankPoint = 0,
}: Props) {
  const router = useRouter();
  const [examResult, setExamResult] = useState<TDateWithExamRes | null>(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const canJoinWeekendTest = rankPoint >= MAX_POINT;

  const dateRange = useMemo(
    () =>
      currentSeason?.startDate
        ? generateDateRange(currentSeason.startDate)
        : [],
    [currentSeason?.startDate]
  );
  const dateRangeWithExamRes = mergeDateRangeWithHistory(
    dateRange,
    seasonHistory
  );

  const todayIndex = useMemo(
    () => dateRange.findIndex((d) => d.date === formattedToday),
    [dateRange]
  );
  const startIndex = Math.floor(todayIndex / DAYS_PER_WEEK) * DAYS_PER_WEEK;

  return (
    <>
      <Carousel
        opts={{
          align: "start",
          slidesToScroll: DAYS_PER_WEEK,
          startIndex,
        }}
        className="w-full border-y-[1px] max-w-2xl"
      >
        <CarouselContent>
          {dateRangeWithExamRes.map((d, index) => {
            const isDayPassed = d.date < formattedToday;
            const isToday = d.date === formattedToday;
            const isSat = d.weekday === "Sat";
            const isSun = d.weekday === "Sun";
            const isSunOfThisWeek = isSun && d.date >= formattedToday;
            const isDoneTest = !!d.createdAt;
            return (
              <CarouselItem
                key={index}
                onClick={() => {
                  if (isDoneTest) {
                    setExamResult(d);
                    setHistoryDialogOpen(true);
                  } else if (isToday) {
                    setAlertOpen(true);
                  }
                }}
                className="sm:basis-1/4 basis-1/3 my-3  md:basis-1/5 lg:basis-[14.25%]"
              >
                <Card
                  className={cn(
                    (isToday || isDoneTest) && " cursor-pointer",
                    isToday && "bg-yellow-100",
                    isDoneTest && "bg-lime-200"
                  )}
                >
                  <CardContent className="flex flex-col relative aspect-[3/4] items-center justify-center p-2">
                    {isDoneTest ? (
                      <BadgeCheck className="size-10 text-lime-700  mb-2 bg-white rounded-full p-1" />
                    ) : isSun ? (
                      <Star
                        className={cn(
                          "size-10 mb-2 rounded-full p-1",
                          canJoinWeekendTest && isSunOfThisWeek
                            ? "bg-lime-700 text-white "
                            : "bg-muted text-black"
                        )}
                      />
                    ) : isDayPassed ? (
                      <X className="size-10  mb-2 bg-muted rounded-full p-1" />
                    ) : (
                      <Check className="size-10  mb-2 bg-muted rounded-full p-1" />
                    )}
                    <div className=" text-sm font-semibold">
                      {weekdayMap[d.weekday]}
                    </div>
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
          })}
          {/* <CarouselItem className="sm:basis-1/4 basis-1/3 my-3  md:basis-1/5 lg:basis-[14.25%]">
            <Card
              onClick={() => {
                setExamResult(null);
                setHistoryDialogOpen(true);
              }}
              className="bg-lime-200 cursor-pointer"
            >
              <CardContent className="flex flex-col  aspect-[3/4] items-center justify-center p-2">
                <BadgeCheck className="size-10 text-lime-700  mb-2 bg-white rounded-full p-1" />
                <div className=" text-sm font-semibold">// ! Done day </div>
                <div className=" text-sm">26/8</div>
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem className="sm:basis-1/4 basis-1/3 my-3  md:basis-1/5 lg:basis-[14.25%]">
            <Card className="">
              <CardContent className="flex flex-col  aspect-[3/4] items-center justify-center p-2">
                <X className="size-10  mb-2 bg-muted rounded-full p-1" />
                <div className=" text-sm font-semibold">// ! passedDay</div>
                <div className=" text-sm">27/8</div>
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem className="sm:basis-1/4 basis-1/3 my-3  md:basis-1/5 lg:basis-[14.25%]">
            <Card
              className="bg-yellow-100 cursor-pointer"
              onClick={() => {
                setAlertOpen(true);
              }}
            >
              <CardContent className="flex flex-col  aspect-[3/4] items-center justify-center p-2">
                <Check className="size-10  mb-2 bg-white rounded-full p-1" />
                <div className=" text-sm font-semibold">Thứ 3</div>
                <div className=" text-sm">27/8</div>
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem className="sm:basis-1/4 my-3 basis-1/3 relative md:basis-1/5 lg:basis-[14.25%]">
            <Card>
              <CardContent className="flex flex-col aspect-[3/4] items-center justify-center p-2">
                <Check className="size-10  mb-2 bg-muted rounded-full p-1" />
                <div className=" text-sm font-semibold">Thứ 7</div>
                <div className=" text-sm">27/8</div>
                <div className="absolute text-sm -top-2 size-7 py-1 text-center -right-2 rounded-full text-white bg-destructive">
                  2X
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem className="sm:basis-1/4 basis-1/3 my-3  md:basis-1/5 lg:basis-[14.25%]">
            <Card className="">
              <CardContent className="flex flex-col  aspect-[3/4] items-center justify-center p-2">
                <Star className="size-10  mb-2 bg-lime-700 text-white rounded-full p-1" />
                <div className=" text-sm font-semibold">Chủ nhật</div>
                <div className=" text-sm">27/8</div>
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem className="sm:basis-1/4 basis-1/3 my-3  md:basis-1/5 lg:basis-[14.25%]">
            <Card className="bg-destructive">
              <CardContent className="flex flex-col  text-white aspect-[3/4] items-center justify-center p-2">
                <Star className="size-10 bg-yellow-300 rounded-full p-1 mb-2" />
                <div className=" text-sm font-semibold">Lên hạng</div>
              </CardContent>
            </Card>
          </CarouselItem> */}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <HistoryDialog
        open={historyDialogOpen}
        onOpenChange={setHistoryDialogOpen}
        rankPoint={rankPoint}
        examResult={examResult}
      />

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bạn có muốn thực hiện bài thi daily không?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction
              onClick={() => {
                router.push("/quizzes/daily-test");
              }}
            >
              Đồng ý
            </AlertDialogAction>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
