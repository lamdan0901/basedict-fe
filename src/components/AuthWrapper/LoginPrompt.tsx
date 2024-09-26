"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { login } from "@/service/actions";
import Image from "next/image";
import { useFormStatus } from "react-dom";

type Props = {
  alertOpen: boolean;
  onOpenChange(open: boolean): void;
};

export function LoginPrompt({ alertOpen, onOpenChange }: Props) {
  return (
    <AlertDialog open={alertOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent aria-describedby={undefined}>
        <AlertDialogHeader>
          <AlertDialogTitle className="sm:!text-center font-medium">
            Tính năng này yêu cầu đăng nhập <br />
            Hãy đăng nhập hoặc đăng kí ở đây
          </AlertDialogTitle>
        </AlertDialogHeader>
        <form className="w-fit mx-auto" action={login}>
          <LoginButton />
        </form>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel className="w-fit">Đóng</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button
      title="Đăng nhập bằng Google"
      type="submit"
      className={pending ? "opacity-50 pointer-events-none" : undefined}
      disabled={pending}
    >
      <Image
        src="/sign-in-desktop.svg"
        width={305}
        height={75}
        alt="sign-in-desktop"
      />
    </button>
  );
}
