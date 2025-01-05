import { useEffect, useState } from "react";

/**
 * Hook to determine if the user is on a mobile device
 */
export const useIsMobileDevice = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = (): boolean => {
      if (typeof window !== "undefined") {
        const userAgent = navigator.userAgent || navigator.vendor;
        // Basic detection for mobile devices
        return /android|iphone|ipad|ipod|blackberry|opera mini|wpdesktop/i.test(
          userAgent
        );
      }
      return false;
    };

    setIsMobile(checkMobile());
  }, []);

  return isMobile;
};
