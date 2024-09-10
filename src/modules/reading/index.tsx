"use client";

import { useAuthAlert } from "@/hooks/useAuthAlert";
import { ReadingDetail } from "@/modules/reading/ReadingDetail";
import { ReadingList } from "@/modules/reading/ReadingList";

export function Reading() {
  const { authContent } = useAuthAlert();

  if (authContent) return authContent;

  return (
    <div className="flex gap-4">
      <ReadingList />
      <ReadingDetail />
    </div>
  );
}
