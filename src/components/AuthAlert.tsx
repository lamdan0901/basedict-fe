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

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AuthAlert({ open, onOpenChange }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent aria-describedby={undefined}>
        <AlertDialogHeader>
          <AlertDialogTitle className="sm:!text-center">
            Tính năng này yêu cầu đăng nhập <br />
            Hãy đăng nhập hoặc đăng kí ở đây
          </AlertDialogTitle>
        </AlertDialogHeader>
        <form className="w-fit mx-auto" action={login}>
          <button type="submit">
            <Image
              src="/sign-in-desktop.svg"
              width={175}
              height={45}
              alt="sign-in-desktop"
            />
          </button>
        </form>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel className="w-fit">Đóng</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
