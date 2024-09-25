import { FlashcardNavbar } from "@/app/(others)/flashcard/_components/FlashcardNavbar";
import { FlashcardPageTitle } from "@/app/(others)/flashcard/_components/FlashcardPageTitle";
import { AdSense } from "@/components/Ad/Ad";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="relative ">
      <FlashcardPageTitle />
      <div className="flex lg:flex-row flex-col gap-2 lg:gap-6">
        <div className="lg:w-[250px] lg:gap-y-6 lg:h-fit flex flex-col shrink-0">
          <FlashcardNavbar />
          <div className="w-full mb-2 lg:mb-0 shrink-0 lg:order-2 order-1 lg:flex-1">
            <AdSense />
          </div>
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
