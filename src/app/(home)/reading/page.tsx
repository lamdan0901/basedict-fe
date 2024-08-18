"use client";

import { Reading } from "@/modules/reading";
import { Suspense } from "react";
import { SWRConfig } from "swr";

export default function ReadingPage() {
  return (
    <Suspense>
      <SWRConfig value={{ errorRetryCount: 2 }}>
        <Reading />
      </SWRConfig>
    </Suspense>
  );
}
