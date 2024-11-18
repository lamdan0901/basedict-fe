"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { FLASHCARD_SETS_LIMIT_MSG } from "@/modules/flashcard/const";
import { useRouter } from "nextjs-toploader/app";

type Props = {
  open: boolean;
  onOpenChange(open: boolean): void;
  onRegister(): void;
  disabled?: boolean;
  isForbidden?: boolean;
  fromLearningPage?: boolean;
};

export function FlashcardSetRegisterPrompt({
  open,
  disabled,
  isForbidden,
  fromLearningPage,
  onRegister,
  onOpenChange,
}: Props) {
  const router = useRouter();
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent aria-describedby={undefined}>
        <AlertDialogHeader>
          <AlertDialogTitle className="sm:!text-center font-medium">
            {isForbidden ? (
              <span className="text-destructive">
                {FLASHCARD_SETS_LIMIT_MSG}
              </span>
            ) : (
              <>
                Bạn chưa đăng kí học bộ flashcard này. <br />
                Bạn có muốn đăng kí không?
              </>
            )}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <Button
            disabled={disabled}
            onClick={() => {
              isForbidden
                ? router.push("/flashcard/my-flashcard")
                : onRegister();
            }}
          >
            {isForbidden ? "OK" : "Đăng kí học"}
          </Button>
          {!isForbidden && (
            <AlertDialogCancel
              onClick={(e) => {
                if (fromLearningPage) {
                  e.preventDefault();
                  router.push("/flashcard/my-flashcard");
                }
              }}
              className="w-fit"
            >
              Đóng
            </AlertDialogCancel>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
