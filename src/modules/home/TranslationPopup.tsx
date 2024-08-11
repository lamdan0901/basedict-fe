import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import useOutsideClick from "@/hooks/useOutsideClick";
import useSWRImmutable from "swr/immutable";
import {
  isJapanese,
  isNotEndingWithForbiddenForms,
  trimAllSpaces,
} from "@/lib";
import { getRequest } from "@/service/data";
import { MEANING_ERR_MSG } from "@/constants";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
  RotateCcw,
} from "lucide-react";

const isSelectionValid = (text: string) =>
  isJapanese(text) && isNotEndingWithForbiddenForms(text);

export function TranslationPopup({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [selection, setSelection] = useState("");
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const [showButton, setShowButton] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [meaningErrMsg, setMeaningErrMsg] = useState("");
  const [meaningIndex, setMeaningIndex] = useState(0);

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

  const showTranslationPopup = () => {
    setShowButton(false);
    setShowPopup(true);
  };

  const showActionButton = (rect: DOMRect) => {
    if (containerRef.current) {
      setButtonPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX + rect.width,
      });
      setShowButton(true);
      setShowPopup(false);
    }
  };

  const clearSelectionTimeout = () => {
    if (selectionTimeoutRef.current) {
      clearTimeout(selectionTimeoutRef.current);
    }
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      if (showPopup) return;

      const selection = window.getSelection();
      if (!selection) return;

      const selectedText = selection.toString().trim();
      if (selectedText && isSelectionValid(selectedText)) {
        setSelection(selectedText);

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        clearSelectionTimeout();

        selectionTimeoutRef.current = setTimeout(() => {
          showActionButton(rect);
        }, 300);
      } else {
        setShowButton(false);
        clearSelectionTimeout();
      }
    };

    const handleDoubleClick = (event: MouseEvent) => {
      if (showPopup || popupRef.current?.contains(event.target as Node)) return;

      const selection = window.getSelection();
      if (!selection) return;

      const selectedText = selection.toString().trim();
      if (selectedText && isSelectionValid(selectedText)) {
        setSelection(selectedText);
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        showActionButton(rect);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        !showPopup &&
        !popupRef.current?.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setShowButton(false);
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("dblclick", handleDoubleClick);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("dblclick", handleDoubleClick);
      document.removeEventListener("mousedown", handleClickOutside);
      clearSelectionTimeout();
    };
  }, [showPopup]);

  useOutsideClick({
    ref: popupRef,
    callback: () => {
      setShowPopup(false);
    },
  });

  const renderPopup = useCallback(() => {
    const currentMeaning = lexemeSearch?.meaning?.[meaningIndex];
    const meaningSize = lexemeSearch?.meaning?.length ?? 0;
    const canNext = meaningIndex < meaningSize - 1;
    const canPrev = meaningIndex > 0;

    return ReactDOM.createPortal(
      <div
        ref={popupRef}
        className="fixed bg-white border w-[300px] min-h-[100px] border-gray-300 p-3 rounded-lg shadow-md"
        style={{
          top: `${buttonPosition.top}px`,
          left: `${buttonPosition.left}px`,
          transform: "translateX(-50%)",
        }}
      >
        {searchingLexeme && "Đang tìm kiếm..."}

        <div className="flex gap-1">
          <span>{lexemeSearch?.hiragana}</span>
          {lexemeSearch?.hanviet && <span>({lexemeSearch?.hanviet})</span>}
          {lexemeSearch?.approved && (
            <CircleCheckBig className="text-green-500 w-4 h-4" />
          )}
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
      document.body
    );
  }, [
    meaningIndex,
    buttonPosition.top,
    buttonPosition.left,
    searchingLexeme,
    lexemeSearch,
    meaningErrMsg,
    retryLexemeSearch,
  ]);

  return (
    <div ref={containerRef}>
      {/* <p>聞く | 厳しい目 聞く 厳しい目 られた</p> */}
      {showButton && (
        <button
          ref={buttonRef}
          className="fixed bg-blue-500 text-white px-2 py-1 rounded text-sm"
          style={{
            top: `${buttonPosition.top}px`,
            left: `${buttonPosition.left}px`,
            zIndex: 9999,
          }}
          onClick={showTranslationPopup}
        >
          Dịch từ
        </button>
      )}
      {showPopup && renderPopup()}
      {children}
    </div>
  );
}
