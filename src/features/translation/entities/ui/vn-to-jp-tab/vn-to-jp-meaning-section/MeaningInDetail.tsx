import { CardIcon } from "@/shared/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/shared/lib";
import { useAppStore } from "@/store/useAppStore";
import { Heart } from "lucide-react";
import { useState } from "react";

type Props = {
  currentMeaning: TMeaning | undefined;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenAddFlashcardModal: () => void;
};

export function MeaningInDetail({
  currentMeaning,
  isFavorite,
  onToggleFavorite,
  onOpenAddFlashcardModal,
}: Props) {
  const profile = useAppStore((state) => state.profile?.id);
  const [showExamples, setShowExamples] = useState(false);

  return (
    <>
      <div className="flex ml-1 justify-between items-center gap-1 flex-wrap">
        <div className="font-semibold text-lg">{currentMeaning?.meaning}</div>
        <div className="flex gap-2 relative items-center">
          {currentMeaning?.context && (
            <div className="bg-slate-50 text-black rounded-full px-6 text-sm border">
              {currentMeaning?.context}
            </div>
          )}
          {profile && (
            <Button
              onClick={onOpenAddFlashcardModal}
              className="rounded-full p-2"
              size="sm"
              variant="ghost"
              title="Thêm vào bộ flashcard"
            >
              <CardIcon />
            </Button>
          )}
          <Button
            onClick={onToggleFavorite}
            className="rounded-full p-2"
            size="sm"
            variant="ghost"
            title="Thêm vào danh sách yêu thích"
          >
            <Heart
              className={cn(" w-5 h-5", isFavorite && "text-destructive")}
            />
          </Button>
        </div>
      </div>

      <p className="pl-1">{currentMeaning?.explaination}</p>

      {currentMeaning?.example && (
        <div>
          <Button
            onClick={() => setShowExamples((prev) => !prev)}
            className="underline text-base px-1"
            variant={"link"}
          >
            {showExamples ? "Ẩn" : "Xem"} ví dụ
          </Button>
          <p
            className={cn(
              "whitespace-pre-line",
              showExamples ? "block" : "hidden"
            )}
          >
            {currentMeaning?.example}
          </p>
        </div>
      )}
    </>
  );
}
