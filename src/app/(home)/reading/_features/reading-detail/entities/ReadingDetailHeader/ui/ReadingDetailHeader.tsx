import { Button } from "@/components/ui/button";
import { useReadingStore } from "@/app/(home)/reading/_model/store";
import { SquareMenu } from "lucide-react";

export function ReadingDetailHeader() {
  const { sheetOpen, setSheetOpen } = useReadingStore();

  return (
    <div className="ml-4 ">
      <h1 className="sm:text-3xl text-2xl ml-2 font-bold">
        Luyện đọc theo cấp độ
      </h1>
      <Button
        onClick={() => setSheetOpen(!sheetOpen)}
        variant={"ghost"}
        className="p-2 gap-2 mt-1 text-primary md:hidden"
      >
        <SquareMenu className="size-6" />{" "}
        <span className="text-lg">Chọn bài đọc khác</span>
      </Button>
    </div>
  );
}
