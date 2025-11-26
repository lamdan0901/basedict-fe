import { VIP_USER } from "@/constants";
import { useAppStore } from "@/store/useAppStore";

export const useIsVipUser = () => {
  const role = useAppStore((state) => state.profile?.role);
  return role === VIP_USER;
};
