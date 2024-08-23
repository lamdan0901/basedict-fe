"use client";

import { HistoryNFavorite } from "@/components/HistoryNFavorite";
import { TranslationPopup } from "@/components/TranslationPopup";
import { usePathname } from "next/navigation";
import { PropsWithChildren, Suspense } from "react";
import { SWRConfig } from "swr";

export function ContentWrapper({ children }: PropsWithChildren) {
  const pathname = usePathname();

  return (
    <main className="max-w-[1440px] flex-1 mx-auto p-4 w-full">
      <TranslationPopup>
        <Suspense>
          <SWRConfig value={{ errorRetryCount: 2, revalidateOnFocus: false }}>
            {children}
            {pathname === "/" && <HistoryNFavorite />}
          </SWRConfig>
        </Suspense>
      </TranslationPopup>
    </main>
  );
}
