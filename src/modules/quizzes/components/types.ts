import { weekdayMap } from "@/modules/quizzes/const";

type TWeekDay = keyof typeof weekdayMap;

type TDateInfo = {
  date: string;
  day: string;
  weekday: TWeekDay;
};

export type TDateWithExamRes = TDateInfo & Partial<TSeasonHistory>;
