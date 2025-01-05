"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/shared/lib";
import { matchingOptions } from "@/features/flashcard/const";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { useState } from "react";

type Props = {
  open?: boolean | undefined;
  onOpenChange?(open: boolean): void;
  onClick(selectedOption: string): void;
  flashCardsLength: number;
};

export function MatchingOptionSelector({
  onOpenChange,
  onClick,
  flashCardsLength,
  open,
}: Props) {
  const [selectedOption, setSelectedOption] = useState(matchingOptions[0]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-medium">
            Hãy chọn số lượng thẻ flashcard để bắt đầu
          </AlertDialogTitle>
          <AlertDialogDescription>
            Số lượng thẻ bạn chọn không lớn hơn số thẻ hiện có
          </AlertDialogDescription>
        </AlertDialogHeader>
        <RadioGroup
          value={selectedOption}
          onValueChange={setSelectedOption}
          className="flex gap-3 justify-center my-4 flex-wrap"
        >
          {matchingOptions.map((option) => {
            const isSelected = selectedOption === option;
            const disabled = +option > flashCardsLength;

            return (
              <div key={option} className={cn("flex items-center space-x-2")}>
                <RadioGroupItem
                  className="text-inherit"
                  value={option}
                  id={option}
                  hidden
                  disabled={disabled}
                />
                <Label
                  className={cn(
                    disabled
                      ? "opacity-70 cursor-not-allowed"
                      : "cursor-pointer"
                  )}
                  htmlFor={option}
                >
                  <Badge
                    className={cn("w-24 h-9 text-base justify-center")}
                    variant={isSelected ? "default" : "outline"}
                  >
                    {option}
                  </Badge>
                </Label>
              </div>
            );
          })}
        </RadioGroup>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogAction onClick={() => onClick(selectedOption)}>
            Bắt đầu
          </AlertDialogAction>
          <AlertDialogCancel className="w-fit">Đóng</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
