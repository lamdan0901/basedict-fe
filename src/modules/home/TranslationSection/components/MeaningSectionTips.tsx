import { cn } from "@/lib";

type Props = {
  hidden?: boolean;
};

export function MeaningSectionTips({ hidden }: Props) {
  return (
    <p
      className={cn(
        "absolute top-1/2 left-5 w-[90%] sm:text-base text-sm text-muted-foreground -translate-y-1/2 pointer-events-none",
        hidden ? "hidden" : "block"
      )}
    >
      Tips: <br />
      - Hãy bấm vào phần dịch nghĩa để xem các nghĩa khác của từ. <br />- Bạn có
      thể quét chọn 1 từ tiếng nhật bất kì, click "Dịch từ" để dịch nhanh.
    </p>
  );
}
