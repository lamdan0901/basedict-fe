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
import { QUIZ_LIMIT_MSG } from "@/features/quizzes/const";
import { useRouter } from "nextjs-toploader/app";

type Props = {
  open: boolean;
  onOpenChange(open: boolean): void;
  onRegister(): void;
  disabled?: boolean;
  isForbidden?: boolean;
  fromLearningPage?: boolean;
};

export function QuizRegisterPrompt({
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
              <span className="text-destructive">{QUIZ_LIMIT_MSG}</span>
            ) : (
              <>
                Bạn chưa đăng kí làm đề này. <br />
                Bạn có muốn đăng kí không?
              </>
            )}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <Button
            disabled={disabled}
            onClick={() => {
              isForbidden ? router.push("/quizzes/my-quizzes") : onRegister();
            }}
          >
            {isForbidden ? "OK" : "Đăng kí làm"}
          </Button>
          {!isForbidden && (
            <AlertDialogCancel
              onClick={(e) => {
                if (fromLearningPage) {
                  e.preventDefault();
                  router.push("/quizzes/my-quizzes");
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
