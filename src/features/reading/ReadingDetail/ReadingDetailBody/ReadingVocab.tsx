import { MeaningPopup } from "@/widgets/translation/ui/popup";
import { Badge } from "@/components/ui/badge";
import { MouseEvent, useRef, useState } from "react";

export function ReadingVocab({ lexemes }: { lexemes?: string[] }) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupTriggerPosition, setPopupTriggerPosition] = useState({
    top: 0,
    left: 0,
  });

  const handleWordClick =
    (lexeme: string) => (e: MouseEvent<HTMLDivElement>) => {
      setShowPopup(true);
      setSelection(lexeme);
      setPopupTriggerPosition({
        top: e.clientY,
        left: e.clientX,
      });
    };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <h2 className="text-lg font-semibold">Từ vựng: </h2>
        {lexemes?.map((lexeme, i) => (
          <Badge
            className="cursor-pointer text-sm sm:text-base"
            onClick={handleWordClick(lexeme)}
            key={i}
          >
            {lexeme}
          </Badge>
        ))}
      </div>
      {showPopup && (
        <MeaningPopup
          ref={popupRef}
          selection={selection}
          popupTriggerPosition={popupTriggerPosition}
          showPopup={showPopup}
          setShowPopup={setShowPopup}
        />
      )}
    </>
  );
}
