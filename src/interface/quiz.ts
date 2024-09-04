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
