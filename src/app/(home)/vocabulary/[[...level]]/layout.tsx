import { VocabNavbar } from "@/app/(home)/vocabulary/[[...level]]/_components/VocabNavbar";
import { AdSense } from "@/components/Ad/Ad";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="relative ">
      <h1 className="sm:text-3xl mb-4 text-center text-2xl ml-2 font-bold">
        Học từ vựng
      </h1>
      <div className="flex lg:flex-row flex-col gap-2 lg:gap-6">
        <div className="lg:w-[250px] lg:gap-y-6 lg:h-fit flex flex-col shrink-0">
          <VocabNavbar />
          <div className="w-full mb-2 shrink-0 lg:order-2 order-1 lg:h-72">
            <AdSense slot="vertical" />
          </div>
        </div>
        <div className="flex-1">{children}</div>
        <div className="w-[250px] hidden lg:block shrink-0">
          <AdSense slot="vertical" />
        </div>
      </div>
    </div>
  );
}
