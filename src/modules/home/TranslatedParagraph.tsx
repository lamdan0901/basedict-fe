import { useLexemeStore } from "@/store/useLexemeStore";
import { Card, CardContent } from "@/components/ui/card";

export function TranslatedParagraph({
  isLoading,
  error,
}: {
  isLoading: boolean;
  error: any;
}) {
  const { translatedParagraph } = useLexemeStore();
  return (
    <Card className="w-full rounded-2xl h-fit sm:min-h-[328px] relative ">
      <CardContent id="translated-paragraph" className="!p-4 space-y-2">
        {isLoading ? (
          "Đang dịch..."
        ) : translatedParagraph ? (
          <div className="text-xl" id="translated-paragraph">
            {translatedParagraph}
          </div>
        ) : error ? (
          <p className="text-destructive">Có lỗi xảy ra khi dịch đoạn văn</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
