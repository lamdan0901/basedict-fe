import { cn } from "@/lib";

type Props = {
  hidden?: boolean;
};

export function TranslationTips({ hidden }: Props) {
  return (
    <p
      className={cn(
        "absolute sm:top-1/2 top-[60%] left-5 w-[90%] sm:text-sm lg:text-base text-xs text-muted-foreground -translate-y-1/2 pointer-events-none",
        hidden ? "hidden" : "block"
      )}
    >
      Tips: <br />
      - Ứng dụng dịch song ngữ Nhật - Việt và Việt - Nhật <br /> - Chúng tôi hỗ
      trợ dịch từ đơn, cụm từ, hoặc bất kỳ từ ngữ tiếng Nhật hoặc tiếng Việt nào
      có nghĩa. Độ dài tối đa cho một từ hoặc cụm từ là 15 ký tự <br />- Bạn
      cũng có thể dịch đoạn văn bản dài đến 2000 ký tự. Với văn bản dài hơn 20
      từ, ứng dụng sẽ tự động chuyển sang chế độ dịch đoạn văn
    </p>
  );
}
