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

type TQuizTag = {
  id: number;
  count: number;
  name: string;
};

type TQuizCreator = TUser & {
  examNumber: number;
  totalLearnedNumber: number;
  totalLearningNumber: number;
  exams: TQuiz[];
};

type TQuizQuestion = {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: string;
  explanation: string;
};

type TQuizReadingQuestion = {
  question: string;
  answers: string[];
  correctAnswer: string;
  explanation?: string;
};

type TQuizReading = {
  japanese: string;
  questions: TQuizReadingQuestion[];
};

type TQuiz = {
  id: number;
  jlptLevel: string;
  title: string;
  description: string;
  owner: TUser;
  tags: string[];
  updatedAt: string;
  learnedNumber: number;
  learningNumber: number;
  questionNumber: number;
  questions: TQuizQuestion[];
  readings: TQuizReading[];
  isLearning: boolean;
  isDone?: boolean;
};

type TMyQuiz = {
  myExams: TQuiz[];
  learningExams: TQuiz[];
  totalLearnedNumber: number;
  totalLearningNumber: number;
};
