import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { getRequest, postRequest } from "@/service/data";
import { DialogDescription } from "@radix-ui/react-dialog";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import { BookX, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { FLASHCARD_LIMIT_MSG } from "@/modules/flashcard/const";
import { useToast } from "@/components/ui/use-toast";
import { LoginPrompt } from "@/components/AuthWrapper/LoginPrompt";
import { useAppStore } from "@/store/useAppStore";

type Props = {
  open: boolean;
  onOpenChange(open: boolean): void;
  lexeme?: TLexeme | null | undefined;
  currentMeaning?: TMeaning | undefined;
};

export function AddNewFlashcardModal({
  lexeme,
  currentMeaning,
  open,
  onOpenChange,
}: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const profile = useAppStore((state) => state.profile);
  const [selectedSet, setSelectedSet] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);

  const { data: myFlashcardSet, isLoading } = useSWR<TMyFlashcard>(
    profile && open ? `/v1/flash-card-sets/my-flash-card` : null,
    getRequest
  );
  const { trigger: addToFlashcardSet, isMutating: isAddingToFlashcardSet } =
    useSWRMutation(
      `/v1/flash-card-sets/${selectedSet}/add-flashcard`,
      postRequest
    );

  const myFlashCards = myFlashcardSet?.myFlashCards ?? [];
  const hasFlashcardSet = myFlashCards.length > 0;

  async function handleSubmit() {
    if (!hasFlashcardSet) {
      router.push("/flashcard/create");
      return;
    }
    if (!selectedSet) return;

    try {
      const hanviet = lexeme?.hanviet ? `(${lexeme?.hanviet})` : "";
      const hiragana2 = lexeme?.hiragana2 ? `/ ${lexeme?.hiragana2}` : "";

      await addToFlashcardSet({
        frontSide: lexeme?.standard,
        frontSideComment: `${lexeme?.lexeme} ${hanviet}\n${lexeme?.hiragana} ${hiragana2}`,
        backSide: currentMeaning?.meaning,
        backSideComment: currentMeaning?.explaination,
      });

      toast({
        title: "Thêm flashcard thành công",
        action: <Check className="h-5 w-5 text-green-500" />,
      });
      onOpenChange(false);
    } catch (err) {
      if (err === "FORBIDDEN") {
        setErrorMsg(FLASHCARD_LIMIT_MSG);
        return;
      }
      setErrorMsg("Có lỗi xảy ra, vui lòng thử lại");
      console.log("err: ", err);
    }
  }

  useEffect(() => {
    if (!profile && open) setLoginPromptOpen(true);
  }, [profile, open]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent aria-describedby="" className="sm:min-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thêm vào bộ flashcard của bạn</DialogTitle>
            <DialogDescription>
              {hasFlashcardSet && (
                <span>Hãy chọn một bộ flashcard bạn muốn thêm vào</span>
              )}
              {isLoading && (
                <span>Đang tải danh sách các bộ flashcard hiện có...</span>
              )}
              <br />
              {errorMsg && <div className="text-destructive">{errorMsg}</div>}
            </DialogDescription>
          </DialogHeader>

          <div className="mb-12">
            {!hasFlashcardSet && !isLoading && (
              <div className="h-40 flex flex-col items-center justify-center gap-y-4">
                <BookX className="size-28 text-muted-foreground" />
                <span>Bạn chưa có bộ flashcard nào</span>
              </div>
            )}

            <RadioGroup
              value={selectedSet}
              onValueChange={setSelectedSet}
              className="flex flex-col gap-3 justify-center"
            >
              {myFlashCards.map((card) => {
                const value = String(card.id);
                const isSelected = selectedSet === value;
                return (
                  <div key={value}>
                    <RadioGroupItem
                      className="text-inherit"
                      value={value}
                      id={value}
                      hidden
                    />
                    <Label className={"cursor-pointer"} htmlFor={value}>
                      <Badge
                        className="h-10 text-base truncate max-w-[462px] block pt-1.5 font-normal w-full text-center"
                        variant={isSelected ? "default" : "outline"}
                      >
                        {card.title}
                      </Badge>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          <DialogFooter className="sm:mt-6 fixed left-1/2 bottom-[20px] -translate-x-1/2 mt-3 sm:justify-center sm:space-x-4">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={
                isAddingToFlashcardSet || (hasFlashcardSet && !selectedSet)
              }
            >
              {!hasFlashcardSet
                ? "Tạo một bộ flashcard ngay"
                : "Thêm ngay vào bộ flashcard"}
            </Button>
            <Button
              disabled={isAddingToFlashcardSet}
              onClick={() => {
                onOpenChange(false);
              }}
              type="button"
              variant={"outline"}
            >
              Hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <LoginPrompt open={loginPromptOpen} onOpenChange={setLoginPromptOpen} />
    </>
  );
}
