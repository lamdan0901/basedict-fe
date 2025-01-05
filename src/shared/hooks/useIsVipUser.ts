import { VIP_USER } from "@/shared/constants";
import { useAppStore } from "@/store/useAppStore";

export const useIsVipUser = () => {
  const roles = useAppStore((state) => state.profile?.roles);
  return roles?.includes(VIP_USER);
};
