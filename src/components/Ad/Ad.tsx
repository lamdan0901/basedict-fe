"use client";

import { Adsense as ReactAdsense } from "@ctrl/react-adsense";

export function AdSense() {
  return (
    <ReactAdsense
      client="ca-pub-9085997021434962"
      slot="5107312515"
      style={{ display: "block" }}
      layout="in-article"
      format="fluid"
    />
  );
}
