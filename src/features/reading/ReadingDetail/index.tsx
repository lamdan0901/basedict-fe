import { AdSense } from "@/components/ui/ad";
import { ReadingDetailBody } from "@/features/reading/ReadingDetail/ReadingDetailBody";
import { ReadingDetailHeader } from "@/features/reading/ReadingDetail/ReadingDetailHeader";

export function ReadingDetail() {
  return (
    <div className="w-full mb-2">
      <ReadingDetailHeader />
      <ReadingDetailBody />
      <AdSense slot="horizontal" />
    </div>
  );
}
