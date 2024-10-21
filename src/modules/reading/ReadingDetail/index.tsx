import { AdSense } from "@/components/Ad/Ad";
import { ReadingDetailBody } from "@/modules/reading/ReadingDetail/ReadingDetailBody";
import { ReadingDetailHeader } from "@/modules/reading/ReadingDetail/ReadingDetailHeader";

export function ReadingDetail() {
  return (
    <div className="w-full mb-2">
      <ReadingDetailHeader />
      <ReadingDetailBody />
      <AdSense slot="horizontal" />
    </div>
  );
}
