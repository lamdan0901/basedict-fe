import { VocabNavbar } from "@/app/(home)/vocabulary/[[...level]]/_components/VocabNavbar";
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
          <div className="w-full mb-2 lg:mb-0 shrink-0 lg:order-2 order-1 h-40 lg:h-72 lg:flex-1 border">
            Ads
          </div>
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
