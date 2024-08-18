import { cn } from "@/lib";
import { readingTypes } from "@/modules/reading/const";
import { useReadingStore } from "@/store/useReadingStore";
import { Check } from "lucide-react";

export function ReadingItem({
  id,
  title,
  jlptLevel,
  readingType,
  isRead,
}: TReadingMaterial) {
  const { selectedReadingItemId, setSheetOpen, setReadingItemId } =
    useReadingStore();

  const readingTypeTitle = readingTypes.find(
    (type) => type.value === readingType
  )?.title;
  const isActive = selectedReadingItemId === id;

  function handleReadingClick() {
    if (isActive) return;
    setReadingItemId(id);
    setSheetOpen(false);
  }

  return (
    <div className="space-y-1">
      <div
        onClick={handleReadingClick}
        className={cn(
          "space-y-3 hover:bg-muted cursor-pointer py-2 px-1 rounded-md",
          isActive && "bg-muted"
        )}
      >
        <div className="flex justify-between">
          <h2 title={title} className="text-lg truncate font-semibold">
            {title}
          </h2>
          {isRead && (
            <div className="flex shrink-0 items-center text-sm text-muted-foreground">
              Đã đọc <Check className="w-4 h-4 ml-2" />
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <div className="bg-slate-50 rounded-full px-2 text-sm border">
            {readingTypeTitle}
          </div>
          <div className="bg-slate-50 rounded-full px-4 text-sm border">
            {jlptLevel}
          </div>
        </div>
      </div>
      <div className="w-full h-px bg-muted-foreground"></div>
    </div>
  );
}
