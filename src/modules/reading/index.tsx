"use client";

import { ReadingDetail } from "@/modules/reading/ReadingDetail";
import { ReadingList } from "@/modules/reading/ReadingList";
import { useAppStore } from "@/store/useAppStore";

export function Reading() {
  const profile = useAppStore((state) => state.profile);

  if (!profile)
    return (
      <div className="text-xl text-destructive">
        Vui lòng đăng nhập để tiếp tục
      </div>
    );

  return (
    <div className="flex gap-4">
      <ReadingList />
      <ReadingDetail />
    </div>
  );
}
