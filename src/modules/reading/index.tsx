"use client";

import { ReadingDetail } from "@/modules/reading/ReadingDetail";
import { ReadingList } from "@/modules/reading/ReadingList";
import React from "react";

export function Reading() {
  return (
    <div className="flex gap-4">
      <ReadingList />
      <ReadingDetail />
    </div>
  );
}
