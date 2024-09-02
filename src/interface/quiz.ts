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
