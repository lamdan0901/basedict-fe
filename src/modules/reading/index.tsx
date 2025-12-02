"use client";

import { ReadingDetail } from "@/modules/reading/ReadingDetail";
import { ReadingList } from "@/modules/reading/ReadingList";

export function Reading() {
  return null;
  return (
    <div className="flex gap-4">
      <ReadingList />
      <ReadingDetail />
    </div>
  );
}
