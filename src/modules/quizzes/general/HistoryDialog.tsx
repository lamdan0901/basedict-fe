import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { TDateWithExamRes } from "@/modules/quizzes/general/utils";

type Props = {
  open: boolean;
  onOpenChange(open: boolean): void;
  rankPoint: number;
  examResult: TDateWithExamRes | null;
};

export function HistoryDialog({
  open,
  onOpenChange,
  examResult,
  rankPoint,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="" className="max-w-sm">
        <DialogHeader className="border-b pb-2 border-muted-foreground">
          <DialogTitle>
            Lịch sử thi{" "}
            {new Date(examResult?.createdAt ?? "").toLocaleDateString()}
          </DialogTitle>
        </DialogHeader>
        <div className="w-fit space-y-3 mx-auto text-start">
          <div>Tổng điểm: {examResult?.score}</div>
          <div>Điểm từ vựng: {examResult?.goiScore}</div>
          <div>Điểm ngữ pháp: {examResult?.grammarScore}</div>
          <div>Điểm đọc: {examResult?.readingScore}</div>
          <div className="text-lg font-semibold">
            Điểm tích luỹ: {rankPoint}
          </div>
        </div>
        <DialogFooter>
          <DialogClose>Đóng</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
