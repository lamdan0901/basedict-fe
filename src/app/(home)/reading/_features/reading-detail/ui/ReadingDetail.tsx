"use client";

import { ReadingDetailBody } from "@/app/(home)/reading/_features/reading-detail/entities/ReadingDetailBody";
import { ReadingDetailHeader } from "@/app/(home)/reading/_features/reading-detail/entities/ReadingDetailHeader";
import { AdSense } from "@/components/ui/ad";

export function ReadingDetail() {
  return (
    <div className="w-full mb-2">
      <ReadingDetailHeader />
      <ReadingDetailBody />
      <AdSense slot="horizontal" />
    </div>
  );
}
