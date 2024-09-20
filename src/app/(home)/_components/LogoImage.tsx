"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export function LogoImage() {
  const pathname = usePathname();

  if (pathname.includes("/learn")) return <div className="h-20"></div>;
  return (
    <Image
      className="mt-16 mx-auto object-contain max-h-[150px] w-[417px]"
      src="/images/logo.png"
      priority
      alt="basedict | học tiếng nhật"
      width={500}
      height={500}
    />
  );
}
