"use client";

import { cn } from "@/lib";
import { Adsense as ReactAdsense } from "@ctrl/react-adsense";

const adSlots = {
  horizontal: "8603510875",
  vertical: "4668135298",
  square: "5107312515",
} as const;

type TAdSlot = keyof typeof adSlots;

interface AdSenseProps {
  slot?: TAdSlot;
  style?: React.CSSProperties;
  className?: string | undefined;
}

export function AdSense({ slot = "square", style, className }: AdSenseProps) {
  return null;
  return (
    <ReactAdsense
      client="ca-pub-9085997021434962"
      slot={adSlots[slot]}
      className={cn("block", className)}
      style={style}
      layout="in-article"
      format="auto"
    />
  );
}
