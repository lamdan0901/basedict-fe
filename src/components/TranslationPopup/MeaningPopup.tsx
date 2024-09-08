import { Button } from "@/components/ui/button";
import { MEANING_ERR_MSG } from "@/constants";
import useOutsideClick from "@/hooks/useOutsideClick";
import { cn, trimAllSpaces } from "@/lib";
import { getRequest } from "@/service/data";
import {
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
  RotateCcw,
} from "lucide-react";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useSWRImmutable from "swr/immutable";

type MeaningPopupProps = {
  selection: string;
  showPopup: boolean;
  popupTriggerPosition: { top: number; left: number };
  setShowPopup: (show: boolean) => void;
};

const leftPadding = 145;
const rightPadding = 160;
const bottomPadding = 160;
const topPadding = 20;

export const MeaningPopup = forwardRef<HTMLDivElement, MeaningPopupProps>(
  ({ selection, showPopup, popupTriggerPosition, setShowPopup }, _) => {
    const [coords, setCoords] = useState({
      top: popupTriggerPosition.top,
      left: popupTriggerPosition.left,
    });
    const [meaningErrMsg, setMeaningErrMsg] = useState("");
    const [meaningIndex, setMeaningIndex] = useState(0);

    const [containerWidth, setContainerWidth] = useState(300);
    const titleRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    const {
      data: lexemeSearch,
      isLoading: searchingLexeme,
      mutate: retryLexemeSearch,
    } = useSWRImmutable<TLexeme>(
      selection && showPopup
        ? `/v1/lexemes/search/${trimAllSpaces(selection)}`
        : null,
      getRequest,
      {
        onError(errMsg) {
          setMeaningErrMsg(
            MEANING_ERR_MSG[errMsg as keyof typeof MEANING_ERR_MSG] ??
              MEANING_ERR_MSG.UNKNOWN
          );
          console.error("err searching lexeme: ", errMsg);
        },
      }
    );

    const currentMeaning = lexemeSearch?.meaning?.[meaningIndex];
    const meaningSize = lexemeSearch?.meaning?.length ?? 0;
    const canNext = meaningIndex < meaningSize - 1;
    const canPrev = meaningIndex > 0;

    useOutsideClick({
      ref: popupRef,
      callback: () => {
        setShowPopup(false);
        setMeaningIndex(0);
      },
    });

    const calculatePosition = useCallback(() => {
      let { top, left } = popupTriggerPosition;
      let { height } = popupRef?.current?.getBoundingClientRect() ?? {
        height: 150,
      };
      const width = containerWidth;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Prevent tooltip from overflowing the left or right side of the viewport
      if (left + width / 2 > viewportWidth - rightPadding) {
        left = viewportWidth - width / 2 - 10;
      } else if (left - width / 2 < leftPadding) {
        left = width / 2 + leftPadding / 2 - 60;
      }

      // Prevent tooltip from overflowing the bottom side of the viewport
      if (top + height > viewportHeight - bottomPadding) {
        top -= height + topPadding;
      }

      setCoords({
        top,
        left,
      });
    }, [popupTriggerPosition, containerWidth]);

    useEffect(() => {
      calculatePosition();
    }, [calculatePosition]);

    useEffect(() => {
      const titleEl = titleRef.current;

      const updateWidth = () => {
        requestAnimationFrame(() => {
          if (titleEl && popupRef.current) {
            const titleWidth = titleEl.clientWidth;
            const newWidth = Math.min(Math.max(titleWidth + 40, 300), 500);
            setContainerWidth(newWidth);
            popupRef.current.style.width = `${newWidth}px`;
          }
        });
      };

      updateWidth();
      calculatePosition();

      const resizeObserver = new ResizeObserver(updateWidth);
      if (titleEl) {
        resizeObserver.observe(titleEl);
      }

      return () => {
        if (titleEl) {
          resizeObserver.unobserve(titleEl);
        }
      };
    }, [lexemeSearch, popupTriggerPosition, calculatePosition]);

    return createPortal(
      <div
        ref={popupRef}
        className="fixed z-[99999] bg-white border min-h-[150px] border-gray-300 p-3 rounded-lg shadow-md"
        style={{
          top: `${coords.top}px`,
          left: `${coords.left}px`,
          transform: "translateX(-50%)",
          width: `${containerWidth}px`,
        }}
      >
        {searchingLexeme && "Đang tìm kiếm..."}

        <div
          ref={titleRef}
          className={cn("w-fit", meaningSize > 1 && " pr-12")}
        >
          <div>
            {lexemeSearch?.standard}{" "}
            {lexemeSearch?.standard !== lexemeSearch?.lexeme
              ? `(${lexemeSearch?.lexeme})`
              : ""}{" "}
            {lexemeSearch?.approved && (
              <CircleCheckBig className="text-green-500 shrink-0 w-4 h-4" />
            )}
          </div>
          <div className="flex gap-1 flex-nowrap">
            <span>{lexemeSearch?.hiragana}</span>
            {lexemeSearch?.hanviet && <span>({lexemeSearch?.hanviet})</span>}
          </div>
        </div>

        <h2 className="text-lg font-semibold my-2">
          {currentMeaning?.meaning}
        </h2>
        <p className="text-sm">{currentMeaning?.explaination}</p>

        {meaningSize > 1 && (
          <div className="flex absolute top-3 right-1 gap-1">
            <Button
              size={"sm"}
              disabled={!canPrev}
              variant={"ghost"}
              onClick={() => setMeaningIndex(meaningIndex - 1)}
              className="p-1 text-muted-foreground h-fit rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              size={"sm"}
              disabled={!canNext}
              variant={"ghost"}
              onClick={() => setMeaningIndex(meaningIndex + 1)}
              className="p-1 text-muted-foreground h-fit rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}

        {meaningErrMsg ? (
          <div>
            <Button
              onClick={() => retryLexemeSearch()}
              variant={"link"}
              className="text-xl px-1"
            >
              <RotateCcw className="w-5 h-5 mr-2" /> Thử lại
            </Button>
            <p className="text-destructive">{meaningErrMsg}</p>
          </div>
        ) : null}
      </div>,
      document.body,
      "meaning-popup"
    );
  }
);
