import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/shared/lib";
import { PopoverProps } from "@radix-ui/react-popover";

type Props = PopoverProps & {
  onHideTips: () => void;
  popContentClassName?: string | undefined;
  popTriggerClassName?: string | undefined;
  side?: "top" | "bottom" | "left" | "right" | undefined;
  align?: "start" | "center" | "end" | undefined;
  tipTitle: string;
};

export function TipsPopup({
  onHideTips,
  side = "top",
  align = "start",
  popContentClassName,
  popTriggerClassName,
  tipTitle,
  ...props
}: Props) {
  return (
    <Popover {...props}>
      <PopoverTrigger asChild>
        <button className={cn("h-2", popTriggerClassName)}></button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("p-1.5 bg-red-100 w-[195px]", popContentClassName)}
        side={side}
        align={align}
      >
        <div className="text-sm">{tipTitle}</div>
        <div className="flex items-center mt-1 space-x-2">
          <Checkbox onCheckedChange={onHideTips} id="popup-tips" />
          <label htmlFor="popup-tips" className="text-xs">
            Không hiện tips này nữa
          </label>
        </div>
      </PopoverContent>
    </Popover>
  );
}
