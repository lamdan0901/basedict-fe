import { AddNewFlashcardModal } from "@/widgets/add-new-flashcard-modal";
import { CardIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { HistoryItemType, MEANING_ERR_MSG } from "@/shared/constants";
import useOutsideClick from "@/shared/hooks/useOutsideClick";
import { cn, trimAllSpaces } from "@/shared/lib";
import { getRequest } from "@/service/data";
import { useFavoriteStore } from "@/store/useFavoriteStore";
import {
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
  Heart,
  RotateCcw,
} from "lucide-react";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useSWRImmutable from "swr/immutable";
import { v4 as uuid } from "uuid";

type MeaningPopupProps = {
  selection: string;
  showPopup: boolean;
  isTriggeredByActionButton?: boolean;
  popupTriggerPosition: { top: number; left: number };
  setShowPopup: (show: boolean) => void;
};

const leftPadding = 145;
const rightPadding = 160;
const bottomPadding = 160;
const topPadding = 20;

export const MeaningPopup = forwardRef<HTMLDivElement, MeaningPopupProps>(
  (
    {
      selection,
      showPopup,
      popupTriggerPosition,
      isTriggeredByActionButton,
      setShowPopup,
    },
    _
  ) => {
    const { addFavoriteItem, removeFavoriteItem, isFavoriteItem } =
      useFavoriteStore();
    const [coords, setCoords] = useState({
      top: popupTriggerPosition.top,
      left: popupTriggerPosition.left,
    });
    const [meaningErrMsg, setMeaningErrMsg] = useState("");
    const [meaningIndex, setMeaningIndex] = useState(0);
    const [selectedLexeme, setSelectedLexeme] = useState<{
      lexeme: TLexeme;
      currentMeaning: TMeaning;
    } | null>(null);

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
    const isFavorite = isFavoriteItem(lexemeSearch?.id);

    function toggleFavorite(lexeme: TLexeme, isFavorite: boolean) {
      if (isFavorite) {
        removeFavoriteItem(lexeme.id);
      } else {
        addFavoriteItem({
          ...lexeme,
          uid: uuid(),
          type: HistoryItemType.Lexeme,
        });
      }
    }

    useOutsideClick({
      ref: popupRef,
      callback: () => {
        if (selectedLexeme) return;
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
      } else if (!isTriggeredByActionButton) {
        top += topPadding;
      }

      setCoords({
        top,
        left,
      });
    }, [popupTriggerPosition, isTriggeredByActionButton, containerWidth]);

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

    return (
      <>
        {createPortal(
          <div
            ref={popupRef}
            className={cn(
              "fixed  bg-white border min-h-[150px] border-gray-300 p-3 rounded-lg shadow-md",
              selectedLexeme ? "z-[9]" : "z-[99999]"
            )}
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
              className={cn("w-fit", currentMeaning && " pr-16")}
            >
              <div>
                {lexemeSearch?.standard}{" "}
                {lexemeSearch?.standard !== lexemeSearch?.lexeme
                  ? `(${lexemeSearch?.lexeme})`
                  : ""}{" "}
                {lexemeSearch?.hanviet && (
                  <span>({lexemeSearch?.hanviet})</span>
                )}
                {lexemeSearch?.approved && (
                  <CircleCheckBig className="text-green-500 shrink-0 w-4 h-4" />
                )}
              </div>
              <div className="flex gap-1 flex-nowrap">
                <span>{lexemeSearch?.hiragana}</span>
                {lexemeSearch?.hiragana2 && (
                  <span>/ {lexemeSearch?.hiragana2}</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold my-2">
                {currentMeaning?.meaning}
              </h2>
              {meaningSize > 1 && (
                <div className="flex items-center -mr-1 gap-1">
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
            </div>
            <p className="text-sm">{currentMeaning?.explaination}</p>

            <div className="flex items-center absolute top-2 right-2 gap-1">
              {currentMeaning && (
                <>
                  <Button
                    onClick={() => {
                      setSelectedLexeme({
                        lexeme: lexemeSearch,
                        currentMeaning,
                      });
                    }}
                    className="rounded-full h-fit p-1"
                    size="sm"
                    variant="ghost"
                    title="Thêm vào bộ flashcard"
                  >
                    <CardIcon />
                  </Button>
                  <Button
                    onClick={() => toggleFavorite(lexemeSearch, isFavorite)}
                    className="rounded-full h-fit p-1"
                    size="sm"
                    variant="ghost"
                    title="Thêm vào danh sách yêu thích"
                  >
                    <Heart
                      className={cn(
                        " w-5 h-5",
                        isFavorite && "text-destructive"
                      )}
                    />
                  </Button>
                </>
              )}
            </div>

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
        )}

        <AddNewFlashcardModal
          {...selectedLexeme}
          open={!!selectedLexeme}
          onOpenChange={() => setSelectedLexeme(null)}
        />
      </>
    );
  }
);
