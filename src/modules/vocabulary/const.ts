export enum TabVal {
  Levels = "levels",
  VocabBooks = "vocabBooks",
}

export enum LearningState {
  All = "all",
  Learned = "learned",
  Unlearned = "unlearned",
}

export const learningStateOptions = [
  {
    label: "Tất cả",
    value: LearningState.All,
  },
  {
    label: "Đã học",
    value: LearningState.Learned,
  },
  {
    label: "Chưa học",
    value: LearningState.Unlearned,
  },
];
