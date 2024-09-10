import { fetchUserProfile } from "@/service/user";
import { useAlertStore } from "@/store/useAlertStore";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef } from "react";
import useSWR from "swr";

export function useAuthAlert() {
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);
  const alertOpenRef = useRef(false);
  const { data: user, isLoading } = useSWR<TUser>("get-user", fetchUserProfile);
  const { setLoginAlertOpen } = useAlertStore();

  useEffect(() => {
    if (isLoading) return;

    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      alertOpenRef.current = false;
    }

    if (!user && !alertOpenRef.current) {
      setLoginAlertOpen(true);
      alertOpenRef.current = true;
    }
  }, [isLoading, setLoginAlertOpen, pathname, user]);

  const authContent: ReactNode = isLoading ? (
    <div>Đang tải...</div>
  ) : !user ? (
    <div className="text-xl text-destructive">
      Vui lòng đăng nhập để tiếp tục
    </div>
  ) : null;

  return { user, isLoading, authContent };
}
