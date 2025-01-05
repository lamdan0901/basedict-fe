"use client";

import { ReadingDetail } from "@/features/reading/ReadingDetail";
import { ReadingList } from "@/features/reading/ReadingList";

export function Reading() {
  return (
    <div className="flex gap-4">
      <ReadingList />
      <ReadingDetail />
    </div>
  );
}
