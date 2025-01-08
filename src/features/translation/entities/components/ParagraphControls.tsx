import { Button } from "@/components/ui/button";
import { cn } from "@/shared/lib";
import { Pencil } from "lucide-react";

type ParagraphControlsProps = {
  show: boolean;
  showEditButton: boolean;
  onEdit: () => void;
};

export const ParagraphControls = ({
  show,
  showEditButton,
  onEdit,
}: ParagraphControlsProps) => {
  return (
    <div
      className={cn(
        "flex-wrap h-8 items-center w-full justify-end sm:justify-between px-3",
        "lg:absolute -top-[44px] right-0 lg:w-[calc(100%-200px)]",
        show ? "sm:flex hidden" : "hidden"
      )}
    >
      <div className={cn("text-muted-foreground text-sm italic")}>
        Nhấn Shift + Enter để dịch
      </div>
      <Button
        onClick={onEdit}
        className={cn("gap-1 h-8 p-0", showEditButton ? "flex" : "hidden")}
        variant={"link"}
      >
        <Pencil className="size-5" /> <span>Chỉnh sửa</span>
      </Button>
    </div>
  );
};
