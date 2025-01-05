"use client";

import { androidAppLink, iosAppLink } from "@/shared/constants/app-links";
import { DownloadAppPopup } from "@/widgets/download-app";
import { useIsMobileDevice } from "@/shared/hooks/useIsMobile";
import Image from "next/image";
import { useState } from "react";

export function DownloadApp() {
  const isMobileDevice = useIsMobileDevice();
  const [appLink, setAppLink] = useState("");

  function handleGetOnGGPlay() {
    if (isMobileDevice) {
      window.open(androidAppLink, "_blank");
      return;
    }
    setAppLink(androidAppLink);
  }

  function handleGetOnAppStore() {
    if (isMobileDevice) {
      window.open(iosAppLink, "_blank");
      return;
    }
    setAppLink(iosAppLink);
  }

  return (
    <>
      <div className="col-span-2">
        <h2 className="font-semibold text-xl">Tải ứng dụng</h2>
        <div className="ml-4 mt-2 flex flex-col gap-2 w-fit ">
          <Image
            src="/images/get-it-on-gg-play.png"
            alt="get it on google play"
            className="cursor-pointer"
            onClick={handleGetOnGGPlay}
            width={160}
            height={160}
          />
          <Image
            src="/images/down-on-app-store.png"
            alt="download on the app store"
            className="cursor-pointer"
            onClick={handleGetOnAppStore}
            width={160}
            height={160}
          />
        </div>
      </div>

      <DownloadAppPopup appLink={appLink} onOpenChange={() => setAppLink("")} />
    </>
  );
}
