import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  defaultFlashcardItem,
  FLASHCARD_LIMIT,
} from "@/modules/flashcard/const";
import { TFlashCardSetForm } from "@/modules/flashcard/schema";
import { ChevronRight, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuid } from "uuid";

export function FlashcardItemRegistration({
  onSubmit,
  isMutating,
}: {
  onSubmit: () => void;
  isMutating: boolean;
}) {
  const router = useRouter();
  const {
    register,
    formState: { errors },
  } = useFormContext<TFlashCardSetForm>();
  const { fields, append, remove } = useFieldArray<TFlashCardSetForm>({
    name: "flashCards",
  });
  const total = fields.length;
  const limitReached = total === FLASHCARD_LIMIT;

  return (
    <div className="pt-2 space-y-4 border-t border-muted-foreground">
      <h2 className="text-lg mb-2 font-semibold">Đăng kí thẻ flashcard</h2>

      <div className="space-y-4">
        {fields.map((item, i) => {
          return (
            <Card key={item.uid}>
              <CardContent className="sm:p-4 p-2 items-center relative flex flex-col sm:flex-row gap-2">
                {item.id && (
                  <input type="hidden" {...register(`flashCards.${i}.id`)} />
                )}
                <div className="sm:flex-[3] pr-7 w-full sm:pr-0 space-y-4">
                  <Input
                    variant="outlined"
                    placeholder="Từ mặt trước"
                    error={errors.flashCards?.[i]?.frontSide?.message}
                    {...register(`flashCards.${i}.frontSide`)}
                  />
                  <Textarea
                    variant="outlined"
                    placeholder="Giải nghĩa (tuỳ chọn)"
                    {...register(`flashCards.${i}.frontSideComment`)}
                  />
                </div>
                <ChevronRight className="size-10 sm:rotate-0 rotate-90 text-muted-foreground w-10 shrink-0" />
                <div className="sm:flex-[7] sm:pr-6 w-full space-y-4">
                  <Input
                    variant="outlined"
                    placeholder="Từ mặt sau"
                    error={errors.flashCards?.[i]?.backSide?.message}
                    {...register(`flashCards.${i}.backSide`)}
                  />
                  <Textarea
                    variant="outlined"
                    placeholder="Giải nghĩa (tuỳ chọn)"
                    {...register(`flashCards.${i}.backSideComment`)}
                  />
                </div>
                {total > 1 && (
                  <Button
                    type="button"
                    className={
                      "rounded-full absolute p-2 h-8 z-10 top-1 right-1"
                    }
                    size={"sm"}
                    variant={"ghost"}
                    title="remove"
                    onClick={() => {
                      remove(i);
                    }}
                  >
                    <Trash className="text-destructive size-5" />
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center gap-3 items-center">
        <span>
          {total}/{FLASHCARD_LIMIT}
        </span>
        <Button
          size={"sm"}
          type="button"
          disabled={limitReached || isMutating}
          onClick={() => append(defaultFlashcardItem(uuid()))}
        >
          <Plus className="size-5 mr-2" /> Thêm thẻ mới
        </Button>
        <Button
          variant={"outline"}
          disabled={isMutating}
          onClick={onSubmit}
          size={"sm"}
        >
          Lưu bộ flashcard
        </Button>
        <Button
          variant={"destructive"}
          disabled={isMutating}
          onClick={() => router.back()}
          size={"sm"}
        >
          Hủy
        </Button>
      </div>

      <i className="text-muted-foreground w-fit mx-auto block text-xs">
        Bạn chỉ có thể tạo tối đa {FLASHCARD_LIMIT} thẻ
      </i>
    </div>
  );
}
