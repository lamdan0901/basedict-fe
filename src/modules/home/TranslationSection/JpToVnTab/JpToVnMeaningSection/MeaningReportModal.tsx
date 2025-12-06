import { lexemeRepo } from "@/lib/supabase/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useAppStore } from "@/store/useAppStore";

type MeaningReportModalProps = {
  open: boolean;
  onOpenChange(open: boolean): void;
  lexeme: TLexeme | null | undefined;
  onMeaningReported(): void;
};

type TReportForm = {
  problem: string;
  userSuggest?: string;
};

export function MeaningReportModal({
  lexeme,
  open,
  onOpenChange,
  onMeaningReported,
}: MeaningReportModalProps) {
  const profileId = useAppStore((state) => state.profile?.id);
  const { toast } = useToast();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<TReportForm>({
    mode: "all",
    defaultValues: {
      problem: "",
      userSuggest: "",
    },
  });
  const [isReportingMeaning, setIsReportingMeaning] = useState(false);

  async function reportMeaning(data: TReportForm) {
    if (!lexeme) return;

    try {
      setIsReportingMeaning(true);
      await lexemeRepo.createReport({
        word: lexeme.lexeme,
        problem: data.problem,
        user_suggest: data.userSuggest,
        user_id: profileId!,
      });
      toast({
        title: "Đã báo cáo",
      });
      closeDialog();
      onMeaningReported();
    } catch (err) {
      toast({
        title: "Có lỗi xảy ra, vui lòng thử lại",
        variant: "destructive",
      });
      console.error("err reportMeaning: ", err);
    } finally {
      setIsReportingMeaning(false);
    }
  }

  function closeDialog() {
    onOpenChange(false);
    reset(undefined);
  }

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent
        aria-describedby=""
        className="sm:min-w-[425px] w-full !pb-[80px] max-h-[100dvh] min-w-full"
      >
        <DialogHeader>
          <DialogTitle>Báo cáo</DialogTitle>
        </DialogHeader>
        {!profileId ? (
          <div className="text-xl text-destructive">
            Vui lòng đăng nhập để tiếp tục
          </div>
        ) : (
          <form onSubmit={handleSubmit(reportMeaning)}>
            <div>
              <span className="font-semibold">Từ vựng:</span> {lexeme?.lexeme}
            </div>
            <div className="grid flex-1 grid-rows-2 mb-2 items-center relative">
              <Label htmlFor="problem" className="text-left text-base">
                Vấn đề (*)
              </Label>
              <Input
                id="problem"
                className="col-span-3"
                {...register(`problem`, {
                  required: "Vui lòng nhập vấn đề gặp phải",
                })}
              />
              <p className="text-destructive text-sm absolute -bottom-5 left-0">
                {(errors.problem?.message as string | null) ?? ""}
              </p>
            </div>
            <div className="grid flex-1 grid-rows-2 items-center relative">
              <Label htmlFor="userSuggest" className="text-left text-base">
                Đề xuất của bạn
              </Label>
              <Input
                id="userSuggest"
                className="col-span-3"
                {...register(`userSuggest`)}
              />
            </div>
            <DialogFooter className="sm:mt-6 fixed left-1/2 bottom-[20px] -translate-x-1/2 mt-3 sm:justify-center sm:space-x-4">
              <Button type="submit" disabled={isReportingMeaning}>
                Gửi báo cáo
              </Button>
              <Button
                disabled={isReportingMeaning}
                onClick={closeDialog}
                type="button"
                variant={"outline"}
              >
                Hủy
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
