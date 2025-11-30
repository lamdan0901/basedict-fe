import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { flashcardRepo } from "@/lib/supabase/client";
import useSWR from "swr";
import { BookX, Check } from "lucide-react";
import { memo, useEffect, useState } from "react";
import {
  FLASHCARD_LIMIT_MSG,
  FLASHCARD_SETS_LIMIT,
} from "@/modules/flashcard/const";
import { useToast } from "@/components/ui/use-toast";
import { LoginPrompt } from "@/components/AuthWrapper/LoginPrompt";
import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";

type Props = {
  open: boolean;
  onOpenChange(open: boolean): void;
  lexeme?: TLexeme | null | undefined;
  currentMeaning?: TMeaning | undefined;
};

export const AddNewFlashcardModal = memo<Props>(
  ({ lexeme, currentMeaning, open, onOpenChange }) => {
    const { toast } = useToast();
    const profile = useAppStore((state) => state.profile);
    const [selectedSet, setSelectedSet] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loginPromptOpen, setLoginPromptOpen] = useState(false);
    const [isAddingToFlashcardSet, setIsAddingToFlashcardSet] = useState(false);

    const { data: myFlashcardSet, isLoading } = useSWR<TMyFlashcard>(
      profile?.id && open ? ["my-flash-card", profile.id] : null,
      () => flashcardRepo.getMyFlashcards(profile?.id!)
    );

    const myFlashCards = myFlashcardSet?.myFlashCards ?? [];
    const hasFlashcardSet = myFlashCards.length > 0;

    function formatLexemeToFlashcard() {
      const hanviet = lexeme?.hanviet ? `(${lexeme?.hanviet})` : "";
      const hiragana2 = lexeme?.hiragana2 ? `/ ${lexeme?.hiragana2}` : "";

      return {
        frontSide: lexeme?.standard || "",
        frontSideComment: `${lexeme?.lexeme} ${hanviet}\n${lexeme?.hiragana} ${hiragana2}`,
        backSide: currentMeaning?.meaning || "",
        backSideComment: currentMeaning?.explaination || "",
      };
    }

    async function handleSubmit() {
      if (!selectedSet) return;
      setIsAddingToFlashcardSet(true);

      try {
        await flashcardRepo.addFlashcardToSet(
          selectedSet,
          formatLexemeToFlashcard()
        );

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
      } finally {
        setIsAddingToFlashcardSet(false);
      }
    }

    useEffect(() => {
      if (!profile && open) setLoginPromptOpen(true);
    }, [profile, open]);

    return (
      <>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent aria-describedby="" className="sm:min-w-[575px]">
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
                          className="h-10 text-base truncate max-w-[562px] block pt-1.5 font-normal w-full text-center"
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
              {myFlashCards.length <= FLASHCARD_SETS_LIMIT && (
                <Link
                  href={`/flashcard/create?defaultFlashcard=${JSON.stringify(
                    formatLexemeToFlashcard()
                  )}`}
                >
                  <Button type="button" variant={"outline"}>
                    Tạo bộ flashcard mới
                  </Button>
                </Link>
              )}
              {hasFlashcardSet && (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={
                    isLoading ||
                    isAddingToFlashcardSet ||
                    (hasFlashcardSet && !selectedSet)
                  }
                >
                  Thêm ngay vào bộ flashcard
                </Button>
              )}
              <Button
                disabled={isAddingToFlashcardSet}
                onClick={() => {
                  onOpenChange(false);
                }}
                type="button"
                variant={"destructive"}
              >
                Hủy
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <LoginPrompt open={loginPromptOpen} onOpenChange={setLoginPromptOpen} />
      </>
    );
  },
  (prev, next) =>
    prev.lexeme?.id === next.lexeme?.id &&
    prev.open === next.open &&
    prev.currentMeaning?.meaning === next.currentMeaning?.meaning
);
