import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { DAYS_PER_WEEK, MAX_POINT } from "@/modules/quizzes/const";
import { HistoryDialog } from "@/modules/quizzes/general/HistoryDialog";
import {
  generateDateRange,
  mergeDateRangeWithHistory,
  TDateWithExamRes,
} from "@/modules/quizzes/general/utils";
import { WeekdayCarouselItem } from "@/modules/quizzes/general/WeekdayCarouselItem";
import dayjs from "dayjs";
import { useRouter } from "nextjs-toploader/app";
import { useMemo, useState } from "react";

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
  const isMdScreen = useMediaQuery("(min-width: 768px)");
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
        orientation={isMdScreen ? "horizontal" : "vertical"}
        className="w-full border-y-[1px] max-w-2xl"
      >
        <CarouselContent className="h-[600px] md:h-auto">
          {dateRangeWithExamRes.map((d, index) => (
            <WeekdayCarouselItem
              onShowHistory={() => {
                setExamResult(d);
                setHistoryDialogOpen(true);
              }}
              onShowAlert={() => {
                setAlertOpen(true);
              }}
              canJoinWeekendTest={canJoinWeekendTest}
              formattedToday={formattedToday}
              d={d}
              key={index}
            />
          ))}
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
        <AlertDialogContent aria-describedby={undefined}>
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
