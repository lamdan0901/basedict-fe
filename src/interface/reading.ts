type TJlptLevel = "N1" | "N2" | "N3" | "N4" | "N5";

type TReadingMaterial = {
  id: number;
  title: string;
  jlptLevel: TJlptLevel;
  readingType: number;
  isRead: boolean;
  createdAt: string;
};

type TReadingQuestion = {
  text: string;
  answer: string;
};

type TReadingDetail = TReadingMaterial & {
  japanese: string;
  vietnamese: string;
  topic: string;
  lexemes: string[];
  readingQuestions: TReadingQuestion[];
};
