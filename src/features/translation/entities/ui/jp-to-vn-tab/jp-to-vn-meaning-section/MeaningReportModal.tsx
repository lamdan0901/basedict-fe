import { postRequest } from "@/shared/api/request";
import useSWRMutation from "swr/mutation";
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
  word: string;
  problem: string;
  userSuggest: string;
};

export function MeaningReportModal({
  lexeme,
  open,
  onOpenChange,
  onMeaningReported,
}: MeaningReportModalProps) {
  const profile = useAppStore((state) => state.profile?.id);
  const { toast } = useToast();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<TReportForm>({
    mode: "all",
    defaultValues: {
      word: lexeme?.lexeme ?? "",
      problem: "",
      userSuggest: "",
    },
  });
  const { trigger: reportMeaningTrigger, isMutating: isReportingMeaning } =
    useSWRMutation(`/v1/reports`, postRequest);

  async function reportMeaning(data: TReportForm) {
    try {
      await reportMeaningTrigger(data);
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
        {!profile ? (
          <div className="text-xl text-destructive">
            Vui lòng đăng nhập để tiếp tục
          </div>
        ) : (
          <>
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
              <form onSubmit={handleSubmit(reportMeaning)}>
                <Button type="submit" disabled={isReportingMeaning}>
                  Gửi báo cáo
                </Button>
              </form>
              <Button
                disabled={isReportingMeaning}
                onClick={closeDialog}
                type="button"
                variant={"outline"}
              >
                Hủy
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
