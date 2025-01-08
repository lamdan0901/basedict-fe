import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { jlptDescriptions } from "@/app/(home)/reading/const";
import { useReadingStore } from "@/app/(home)/reading/_model/store";

export function JLPTReadingDescModal() {
  const { jlptModalOpen, setJLPTModalOpen } = useReadingStore();
  return (
    <Dialog open={jlptModalOpen} onOpenChange={setJLPTModalOpen}>
      <Button
        onClick={() => setJLPTModalOpen(true)}
        variant={"link"}
        className="mb-3 underline p-0 ml-1 pt-4"
      >
        Các dạng bài đọc JLPT <CircleHelp className="size-4 ml-2" />
      </Button>
      <DialogContent
        aria-describedby=""
        className="overflow-auto max-h-[100dvh] min-w-full md:min-w-[800px]"
      >
        <DialogHeader>
          <DialogTitle>Các dạng bài đọc JLPT</DialogTitle>
        </DialogHeader>
        <div className="">
          Tùy thuộc vào cấp độ (N5 đến N1), các dạng bài đọc có thể khác nhau về
          độ khó, độ dài và nội dung. Dưới đây là các dạng bài đọc phổ biến
          thường gặp trong kỳ thi JLPT:
          {jlptDescriptions.map((d) => (
            <div key={d.title} className="mt-2">
              <h3 className="font-bold">{d.title}</h3>
              <ul>
                <li className="">
                  <b>・Độ dài:</b> {d.length}
                </li>
                <li className="">
                  <b>・Mục đích:</b> {d.purpose}
                </li>
                <li className="">
                  <b>・Cấp độ:</b> {d.level}
                </li>
              </ul>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
