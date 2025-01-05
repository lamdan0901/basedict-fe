"use client";

import { LoginPrompt } from "@/widgets/auth";
import { fetchUserProfile } from "@/service/user";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import useSWR from "swr";

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
      <LoginPrompt open={alertOpen} onOpenChange={setAlertOpen} />
    </>
  );
}
