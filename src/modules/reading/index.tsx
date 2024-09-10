"use client";

import { AuthWrapper } from "@/components/AuthWrapper";
import { ReadingDetail } from "@/modules/reading/ReadingDetail";
import { ReadingList } from "@/modules/reading/ReadingList";

export function Reading() {
  return (
    <AuthWrapper>
      <div className="flex gap-4">
        <ReadingList />
        <ReadingDetail />
      </div>
    </AuthWrapper>
  );
}
