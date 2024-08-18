type TJlptLevel = "N1" | "N2" | "N3" | "N4" | "N5";

type TReadingMaterial = {
  id: number;
  title: string;
  jlptLevel: TJlptLevel;
  readingType: number;
  isRead: boolean;
};

type TReadingQuestion = {
  text: string;
  answer: string;
};

type TReadingDetail = TReadingMaterial & {
  content: string;
  readingQuestions: TReadingQuestion[];
};
