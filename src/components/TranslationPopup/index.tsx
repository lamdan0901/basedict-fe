"use client";

import { MeaningPopup } from "@/components/TranslationPopup/MeaningPopup";
import { isJapanese, isNotEndingWithForbiddenForms } from "@/lib";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const isSelectionValid = (text: string) =>
  isJapanese(text) && isNotEndingWithForbiddenForms(text);

const noTranslationPages = ["/quizzes/daily-test"];

export function TranslationPopup({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const popupTriggerRef = useRef<HTMLButtonElement>(null);
  const selectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [selection, setSelection] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showTriggerButton, setShowTriggerButton] = useState(false);
  const [popupTriggerPosition, setPopupTriggerPosition] = useState({
    top: 0,
    left: 0,
  });

  const showTranslationPopup = () => {
    setShowTriggerButton(false);
    setShowPopup(true);
  };

  const handleShowPopupTrigger = (rect: DOMRect) => {
    if (containerRef.current) {
      setPopupTriggerPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX + rect.width,
      });
      setShowTriggerButton(true);
      setShowPopup(false);
    }
  };

  const clearSelectionTimeout = () => {
    if (selectionTimeoutRef.current) {
      clearTimeout(selectionTimeoutRef.current);
    }
  };

  useEffect(() => {
    const handleSelectionChange = (event: Event) => {
      if (
        showPopup ||
        lexemeSearchInput?.contains(event.target as Node) ||
        paragraphInput?.contains(event.target as Node) ||
        translatedParagraph?.contains(event.target as Node)
      )
        return;

      const selection = window.getSelection();
      if (!selection) return;

      const selectedText = selection.toString().trim();
      if (selectedText && isSelectionValid(selectedText)) {
        setSelection(selectedText);

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        clearSelectionTimeout();

        selectionTimeoutRef.current = setTimeout(() => {
          handleShowPopupTrigger(rect);
        }, 300);
      } else {
        setShowTriggerButton(false);
        clearSelectionTimeout();
      }
    };

    const handleDoubleClick = (event: MouseEvent) => {
      // Prevent popupTrigger from showing up on popup text or search input
      if (
        showPopup ||
        popupRef.current?.contains(event.target as Node) ||
        lexemeSearchInput?.contains(event.target as Node) ||
        paragraphInput?.contains(event.target as Node) ||
        translatedParagraph?.contains(event.target as Node)
      )
        return;

      const selection = window.getSelection();
      if (!selection) return;

      const selectedText = selection.toString().trim();
      if (selectedText && isSelectionValid(selectedText)) {
        setSelection(selectedText);
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        handleShowPopupTrigger(rect);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        !showPopup &&
        !popupRef.current?.contains(event.target as Node) &&
        !popupTriggerRef.current?.contains(event.target as Node)
      ) {
        setShowTriggerButton(false);
      }
    };

    const lexemeSearchInput = document.getElementById("lexeme-search");
    const paragraphInput = document.getElementById("paragraph-input");
    const translatedParagraph = document.getElementById("translated-paragraph");

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

  const triggerBtn = useMemo(() => {
    if (noTranslationPages.includes(pathname)) return null;

    if (showTriggerButton)
      return createPortal(
        <button
          ref={popupTriggerRef}
          className="fixed z-[99991] bg-blue-500 text-white px-2 py-1 rounded text-sm"
          style={{
            top: `${popupTriggerPosition.top}px`,
            left: `${popupTriggerPosition.left}px`,
            zIndex: 9999,
          }}
          onClick={showTranslationPopup}
        >
          Dịch từ
        </button>,
        document.body,
        "popup-trigger"
      );
  }, [
    pathname,
    popupTriggerPosition.left,
    popupTriggerPosition.top,
    showTriggerButton,
  ]);

  return (
    <div ref={containerRef}>
      {triggerBtn}
      {showPopup && (
        <MeaningPopup
          ref={popupRef}
          selection={selection}
          popupTriggerPosition={popupTriggerPosition}
          showPopup={showPopup}
          setShowPopup={setShowPopup}
          isTriggeredByActionButton
        />
      )}
      {children}
    </div>
  );
}
