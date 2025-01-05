import { weekdayMap } from "@/features/quizzes/const";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);

type TWeekDay = keyof typeof weekdayMap;

type TDateInfo = {
  date: string;
  day: string;
  weekday: TWeekDay;
};

export type TDateWithExamRes = TDateInfo & Partial<TSeasonHistory>;

export const generateDateRange = (start: string): TDateInfo[] => {
  const dateArray: TDateInfo[] = [];
  let currentDate = dayjs(start);
  let lastDayOfWeek = dayjs();

  // Ignore get the last day of the week if it's Sunday
  if (lastDayOfWeek.get("day") !== 0) {
    lastDayOfWeek = lastDayOfWeek.endOf("weeks").add(1, "day"); // Add 1 cuz in this lib, week starts from Sunday, not Monday
  }

  while (currentDate.isSameOrBefore(lastDayOfWeek)) {
    dateArray.push({
      date: currentDate.format("YYYY-MM-DD"),
      day: currentDate.format("DD/MM"),
      weekday: currentDate.format("ddd") as TWeekDay,
    });
    currentDate = currentDate.add(1, "day");
  }

  return dateArray;
};

export function mergeDateRangeWithHistory(
  dateRange: TDateInfo[],
  seasonHistory: TSeasonHistory[]
): TDateWithExamRes[] {
  const mergedData: TDateWithExamRes[] = [];
  let historyIndex = 0;

  for (const dateInfo of dateRange) {
    const historyItem = seasonHistory[historyIndex];
    if (historyItem && historyItem.createdAt === dateInfo.date) {
      mergedData.push({
        ...dateInfo,
        ...historyItem,
      });
      historyIndex++;
    } else {
      mergedData.push(dateInfo);
    }
  }

  return mergedData;
}
