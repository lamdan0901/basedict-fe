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
import { fetchUserProfile } from "@/service/user";
import Image from "next/image";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { useFormStatus } from "react-dom";

export function AuthWrapper({ children }: PropsWithChildren) {
  const alertOpenRef = useRef(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const { data: user, isLoading } = useSWR<TUser>("get-user", fetchUserProfile);

  useEffect(() => {
    if (isLoading) return;

    if (!user && !alertOpenRef.current) {
      setAlertOpen(true);
      alertOpenRef.current = true;
    }
  }, [isLoading, setAlertOpen, user]);

  return (
    <>
      {isLoading ? (
        <div>Đang tải...</div>
      ) : !user ? (
        <div className="text-xl text-destructive">
          Vui lòng đăng nhập để tiếp tục
        </div>
      ) : (
        children
      )}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
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
    </>
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
