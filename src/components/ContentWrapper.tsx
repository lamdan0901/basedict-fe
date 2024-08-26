"use client";

import { TranslationPopup } from "@/components/TranslationPopup";
import { cn } from "@/lib";
import { PropsWithChildren, Suspense } from "react";
import { SWRConfig } from "swr";

export function ContentWrapper({
  children,
  className,
}: PropsWithChildren & { className?: string }) {
  return (
    <main className={cn("max-w-[1440px] flex-1 mx-auto p-4 w-full", className)}>
      <TranslationPopup>
        <Suspense>
          <SWRConfig value={{ errorRetryCount: 2, revalidateOnFocus: false }}>
            {children}
          </SWRConfig>
        </Suspense>
      </TranslationPopup>
    </main>
  );
}
