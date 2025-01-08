"use client";

import { androidAppLink, iosAppLink } from "@/shared/constants/app-links";
import { DownloadAppPopup } from "@/widgets/download-app";
import { AndroidIcon, IosIcon } from "@/shared/icons";
import { Button } from "@/components/ui/button";
import { useIsMobileDevice } from "@/shared/hooks/useIsMobile";
import { useState } from "react";

export function DownloadAppButtons() {
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
      <div className="flex bottom-[-14px] absolute w-full gap-2 justify-center">
        <Button
          className="px-1 h-6 py-0 font-normal"
          variant={"link"}
          onClick={handleGetOnAppStore}
        >
          <IosIcon className="mr-1" /> iPhone
        </Button>
        <Button
          className="px-1 h-6 py-0 font-normal"
          variant={"link"}
          onClick={handleGetOnGGPlay}
        >
          <AndroidIcon className="mr-1" /> Android
        </Button>
      </div>

      <DownloadAppPopup appLink={appLink} onOpenChange={() => setAppLink("")} />
    </>
  );
}
