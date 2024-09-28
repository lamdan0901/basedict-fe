"use client";

import { Adsense as ReactAdsense } from "@ctrl/react-adsense";

const adSlots = {
  horizontal: "8603510875",
  vertical: "4668135298",
  square: "5107312515",
} as const;

interface AdSenseProps {
  slot?: TAdSlot;
  adFormat?: string;
  style?: React.CSSProperties;
}

type TAdSlot = keyof typeof adSlots;

export function AdSense({ slot = "square" }: AdSenseProps) {
  return null;
  return (
    <ReactAdsense
      client="ca-pub-9085997021434962"
      slot={adSlots[slot]}
      style={{ display: "block" }}
      layout="in-article"
      format="fluid"
    />
  );
}
