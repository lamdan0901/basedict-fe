import { v4 as uuid } from "uuid";

export enum TestState {
  Ready,
  Doing,
  Paused,
  Done,
}

export const stateSwitcherTitle = {
  [TestState.Ready]: "Bắt đầu",
  [TestState.Doing]: "Tạm dừng",
  [TestState.Paused]: "Tiếp tục",
  [TestState.Done]: "Làm lại",
};

export const stateSwitcherVariant = {
  [TestState.Ready]: "default",
  [TestState.Doing]: "destructive",
  [TestState.Paused]: "outline",
  [TestState.Done]: "secondary",
} as const;

export const weekdayMap = {
  Mon: "Thứ hai",
  Tue: "Thứ ba",
  Wed: "Thứ tư",
  Thu: "Thứ năm",
  Fri: "Thứ sáu",
  Sat: "Thứ bảy",
  Sun: "Chủ nhật",
} as const;

export const DAYS_PER_WEEK = 7;
export const MAX_POINT = 180;
export const QUIZ_LIMIT = 5;
export const QUIZ_ITEM_LIMIT = 50;
export const QUIZ_LIMIT_MSG = `Bạn chỉ có thể tạo và theo học tối đa ${QUIZ_LIMIT} đề`;

export const questionTypesWithExplanation: TQuestionType[] = [
  "ContextLexeme",
  "Grammar",
  "GrammarAlign",
];

export const quizSortMap = {
  popular: "Độ phổ biến",
  updated_at: "Mới nhất",
};

export const defaultQuizItem = (uid: string) => ({
  question: "",
  answers: ["", "", "", ""],
  correctAnswer: "",
  explanation: "",
  uid,
});

export const defaultQuizFormValue = {
  title: "",
  description: "",
  jlptLevel: "N3",
  questions: [defaultQuizItem(uuid())],
};
