"use client";

import { TranslationPopup } from "@/components/TranslationPopup";
import { PropsWithChildren, Suspense } from "react";
import { SWRConfig } from "swr";

export function ContentWrapper({ children }: PropsWithChildren) {
  return (
    <main className="max-w-[1440px] flex-1 mx-auto p-4 w-full">
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
