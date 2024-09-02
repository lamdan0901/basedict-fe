import { QuizNavbar } from "@/app/(others)/quizzes/_components/QuizNavbar";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex sm:flex-row flex-col gap-6">
      <div className="md:w-[250px] space-y-6 shrink-0 sm:w-[220px] w-full">
        <QuizNavbar />
        <div className="w-full h-full sm:h-72 flex-1 border">Ads</div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
