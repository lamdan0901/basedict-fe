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
};

export type TStateSwitcherRef = {
  resetTimer: () => void;
  currentTimeInMin: string;
};

export const StateSwitcher = forwardRef<TStateSwitcherRef, Props>(
  ({ testState, variant, switchTestState, showAlert }, ref) => {
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

    return (
      <div className="flex gap-4 justify-center items-center">
        <Button variant={variant} className="gap-2" onClick={switchTestState}>
          {stateSwitcherTitle[testState]}
          {shouldShowTimer && <span>{currentTimeInMin}</span>}
        </Button>
        {canShowResult && <Button onClick={showAlert}>Xem kết quả</Button>}
      </div>
    );
  }
);
