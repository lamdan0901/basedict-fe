type TJlptLevel = "N1" | "N2" | "N3" | "N4" | "N5";

type TReadingType =
  | "GrammarReading"
  | "SumaryReading"
  | "MediumReading"
  | "LongReading"
  | "CompareReading"
  | "NoticeReaing";

type TReadingMaterial = {
  id: number;
  title: string;
  jlptLevel: TJlptLevel;
  readingType: TReadingType;
  isRead: boolean;
  createdAt: string;
};

type TReadingQuestion = {
  question: string;
  answers: string[];
  correctAnswer: string;
};

type TReadingDetail = TReadingMaterial & {
  japanese: string;
  vietnamese: string;
  topic: string;
  lexemes: string[];
  readingQuestions: TReadingQuestion[];
};

type TTestPeriod = {
  id: number;
  jlptLevel: TJlptLevel;
  source: string;
  title: string;
};
