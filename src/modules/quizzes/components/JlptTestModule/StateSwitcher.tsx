import { Button } from "@/components/ui/button";
import { formatSecToMinute } from "@/lib";
import {
  stateSwitcherTitle,
  stateSwitcherVariant,
  TestState,
} from "@/modules/quizzes/const";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

type Props = {
  variant: (typeof stateSwitcherVariant)[TestState];
  testState: TestState;
  switchTestState(): void;
  showAlert(): void;
  showResultDialog(): void;
  isDailyTest: boolean | undefined;
};

export type TStateSwitcherRef = {
  resetTimer: () => void;
  currentTimeInMin: string;
};

export const StateSwitcher = forwardRef<TStateSwitcherRef, Props>(
  (
    {
      testState,
      variant,
      isDailyTest,
      showResultDialog,
      switchTestState,
      showAlert,
    },
    ref
  ) => {
    const [currentTimeInSec, setCurrentTimeInSec] = useState(0);

    const canShowResult = [TestState.Paused].includes(testState);
    const shouldShowTimer = [TestState.Paused, TestState.Doing].includes(
      testState
    );
    const currentTimeInMin = formatSecToMinute(currentTimeInSec);

    useEffect(() => {
      let timer: NodeJS.Timeout;

      if (testState === TestState.Doing) {
        timer = setInterval(() => {
          setCurrentTimeInSec((prevSeconds) => prevSeconds + 1);
        }, 1000);
      }

      return () => clearInterval(timer);
    }, [testState]);

    useImperativeHandle(
      ref,
      () => ({
        resetTimer: () => setCurrentTimeInSec(0),
        currentTimeInMin,
      }),
      [currentTimeInMin]
    );

    if (isDailyTest && testState === TestState.Done)
      return (
        <div className="w-fit mx-auto">
          Bạn đã hoàn thành xong bài thi daily
        </div>
      );

    return (
      <div className="flex gap-4 justify-center items-center">
        <Button variant={variant} className="gap-2" onClick={switchTestState}>
          {stateSwitcherTitle[testState]}
          {shouldShowTimer && <span>{currentTimeInMin}</span>}
        </Button>
        {canShowResult && (
          <Button onClick={showAlert}>
            {isDailyTest ? "Kết thúc thi" : "Xem kết quả"}
          </Button>
        )}
        {testState === TestState.Done && (
          <Button onClick={showResultDialog}>Xem kết quả</Button>
        )}
      </div>
    );
  }
);
