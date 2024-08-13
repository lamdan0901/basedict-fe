"use client";

import { Home } from "@/modules/home";
import { Suspense } from "react";
import { SWRConfig } from "swr";

export default function HomePage() {
  return (
    <Suspense>
      <SWRConfig value={{ errorRetryCount: 2, refreshInterval: 2000 }}>
        <Home />
      </SWRConfig>
    </Suspense>
  );
}
