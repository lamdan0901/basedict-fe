import { VocabNavbar } from "@/app/(home)/vocabulary/[[...level]]/_components/VocabNavbar";
import { AdSense } from "@/components/Ad";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="relative ">
      <h1 className="sm:text-3xl mb-4 text-center text-2xl ml-2 font-bold">
        Học từ vựng
      </h1>
      <div className="flex lg:flex-row flex-col gap-2 lg:gap-6">
        <VocabNavbar />
        <AdSense slot="horizontal" className="lg:!hidden" />
        <div className="flex-1">{children}</div>
        <AdSense
          className="w-[250px] hidden lg:block shrink-0"
          slot="vertical"
        />
      </div>
    </div>
  );
}
