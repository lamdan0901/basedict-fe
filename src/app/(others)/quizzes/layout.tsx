import { QuizNavbar } from "@/app/(others)/quizzes/_components/QuizNavbar";
import { AdSense } from "@/components/Ad/Ad";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex relative lg:flex-row flex-col gap-2 lg:gap-6">
      <div className="lg:w-[250px] lg:gap-y-6 lg:h-fit flex flex-col shrink-0">
        <QuizNavbar />
        <div className="w-full mb-2 lg:mb-0 shrink-0 lg:order-2 order-1 lg:h-auto lg:flex-1">
          <AdSense />
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
