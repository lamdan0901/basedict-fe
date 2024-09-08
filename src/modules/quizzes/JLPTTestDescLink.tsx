import { Button } from "@/components/ui/button";
import { CircleHelp } from "lucide-react";
import Link from "next/link";

export function JLPTTestDescLink() {
  return (
    <Link href="/quizzes/jlpt-question-types">
      <Button
        variant={"link"}
        className="mb-3 underline p-0 justify-end ml-1 w-full pt-4"
      >
        Các dạng đề thi JLPT <CircleHelp className="size-4 ml-2" />
      </Button>
    </Link>
  );
}
