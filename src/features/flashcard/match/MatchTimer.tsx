import dayjs from "dayjs";
import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";

interface Props {
  isRunning: boolean;
}

export interface MatchTimerRef {
  reset: () => void;
  restart: () => void;
}

export const MatchTimer = forwardRef<MatchTimerRef, Props>(
  ({ isRunning }, ref) => {
    const [timer, setTimer] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      if (isRunning) {
        startTimer();
      } else {
        stopTimer();
      }
      return () => stopTimer();
    }, [isRunning]);

    const startTimer = () => {
      timerRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    };

    const stopTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };

    const formatTime = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
      return dayjs(new Date(0, 0, 0, hours, minutes, remainingSeconds)).format(
        "HH:mm:ss"
      );
    };

    useImperativeHandle(
      ref,
      () => ({
        reset: () => {
          stopTimer();
          setTimer(0);
        },
        restart: () => {
          setTimer(0);
        },
      }),
      []
    );

    return (
      <div className="top-2 sm:left-1/2 right-0 sm:right-[unset] sm:-translate-x-1/2 absolute">
        {formatTime(timer)}
      </div>
    );
  }
);
