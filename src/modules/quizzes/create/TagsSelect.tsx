import { Label } from "@/components/ui/label";
import MultipleSelector from "@/components/ui/multi-select";
import { useToast } from "@/components/ui/use-toast";
import { axiosData } from "@/lib";
import { MAX_TAG_CHARS, MAX_TAGS } from "@/modules/flashcard/const";
import {
  TFlashCardSetForm,
  TFlashCardTagItem,
} from "@/modules/flashcard/schema";
import { useFieldArray, useFormContext } from "react-hook-form";

export function TagsSelect() {
  const { toast } = useToast();
  const {
    formState: { errors },
    setValue,
  } = useFormContext<TFlashCardSetForm>();

  const { fields, append, remove } = useFieldArray<{
    tags: TFlashCardTagItem[];
  }>({
    name: "tags",
  });

  async function handleSearch(value: string) {
    try {
      const res = await axiosData.get<{ data: TFlashcardTag[] }>(
        `/v1/flash-card-sets/tags`,
        {
          params: {
            search: value,
          },
        }
      );
      return res.data.data?.map((tag) => ({
        value: tag.id.toString(),
        label: `${tag.name} (${tag.count})`,
      }));
    } catch (err) {
      console.log("err: ", err);
      return [];
    }
  }

  return (
    <div className="grid w-full items-center gap-1.5">
      <div className="flex justify-between flex-wrap gap-2">
        <Label htmlFor="description">Tags</Label>
        <div className="text-xs text-muted-foreground italic">
          Bạn chỉ có thể thêm tối đa 3 tags, mỗi tag dài tối đa 15 ký tự
        </div>
      </div>
      <MultipleSelector
        onAppend={append}
        onRemove={remove}
        onClearAll={(fixedOptions) => {
          setValue("tags", fixedOptions);
        }}
        value={fields}
        onSearch={handleSearch}
        inputProps={{ maxLength: MAX_TAG_CHARS }}
        placeholder="Nhập tên tag và Enter để tạo mới hoặc tìm kiếm"
        hidePlaceholderWhenSelected
        creatable
        maxSelected={MAX_TAGS}
        error={errors.tags?.message}
        onMaxSelected={() => {
          toast({
            title: `Bạn chỉ có thể thêm tối đa ${MAX_TAGS} tags`,
            variant: "destructive",
          });
        }}
        loadingIndicator={
          <p className="py-2 text-center text-lg leading-10 text-muted-foreground">
            Đang tìm tag...
          </p>
        }
      />
    </div>
  );
}
