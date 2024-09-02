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
