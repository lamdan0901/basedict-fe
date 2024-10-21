"use client";

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
}

export function AdSense({ slot = "square", style }: AdSenseProps) {
  return (
    <ReactAdsense
      client="ca-pub-9085997021434962"
      slot={adSlots[slot]}
      style={{ display: "block", ...style }}
      layout="in-article"
      format="auto"
    />
  );
}
