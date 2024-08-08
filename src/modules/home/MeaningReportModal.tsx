import { postRequest } from "@/service/data";
import React from "react";
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

type MeaningReportModalProps = {
  open: boolean;
  onOpenChange(open: boolean): void;
  lexeme: TLexeme | null;
};

export function MeaningReportModal({
  lexeme,
  open,
  onOpenChange,
}: MeaningReportModalProps) {
  const { toast } = useToast();
  const {
    register,
    formState: { errors },
  } = useForm<{
    word: string;
    problem: string;
    userSuggest: string;
  }>({
    defaultValues: {
      word: lexeme?.lexeme ?? "",
      problem: "",
      userSuggest: "",
    },
  });
  const { trigger: reportMeaningTrigger, isMutating: isReportingMeaning } =
    useSWRMutation(`/v1/reports`, postRequest);

  async function reportMeaning() {
    try {
      await reportMeaningTrigger();
      onOpenChange(false);
    } catch (err) {
      toast({
        title: "Có lỗi xảy ra, vui lòng thử lại",
        variant: "destructive",
      });
      console.error("err reportMeaning: ", err);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          aria-describedby=""
          className="lg:min-w-[425px] w-full !pb-[80px] max-h-[100dvh] sm:min-w-[825px] min-w-full"
        >
          <DialogHeader>
            <DialogTitle>Báo cáo</DialogTitle>
          </DialogHeader>
          <div>
            {/* nếu search r enter thì gửi text search, nếu chọn từ list rồi enter thì gửi gì */}
            <div>Từ vựng: {lexeme?.lexeme} ??</div>
            <div className="grid flex-1 grid-rows-2 items-center relative">
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
          </div>
          <DialogFooter className="sm:mt-6 fixed left-1/2 bottom-[20px] -translate-x-1/2 mt-3 sm:justify-center sm:space-x-4">
            <Button
              type="button"
              disabled={isReportingMeaning}
              onClick={reportMeaning}
            >
              Gửi báo cáo
            </Button>
            <Button
              disabled={isReportingMeaning}
              onClick={() => onOpenChange(false)}
              type="button"
              variant={"outline"}
            >
              Hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
