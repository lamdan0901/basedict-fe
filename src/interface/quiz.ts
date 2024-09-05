type TTestReading = {
  japanese: string;
  questions: TReadingQuestion[];
};

type TJlptTestItem = {
  id: number;
  title: string;
  jlptLevel: TJlptLevel;
  questions: TReadingQuestion[];
  readings: TTestReading[];
  isDone?: boolean;
};

type TSeason = {
  name: string;
  startDate: string;
  endDate: string;
};

type TSeasonProfile = {
  id: number;
  userId: string;
  rank: TJlptLevel;
  badge: string[];
  rankPoint: number;
  season: TSeason["name"];
};

type TSeasonHistory = {
  id: number;
  userId: string;
  examId: number;
  score: number;
  goiScore: number;
  grammarScore: number;
  readingScore: number;
  answers: string[];
  isUpRank: boolean;
  rankPoint: number;
  createdAt: string;
};
