"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SquareMenu } from "lucide-react";

const menu = [
  {
    title: "Thông tin chung",
    href: "/quizzes/general-info",
  },
  {
    title: "Luyện thi BaseDict",
    href: "/quizzes/basedict-test",
  },
  {
    title: "Làm đề JLPT",
    href: "/quizzes/jlpt-test",
  },
  {
    title: "Bảng xếp hạng",
    href: "/quizzes/ranking",
  },
  {
    title: "Các dạng bài đề thi JLPT",
    href: "/quizzes/jlpt-question-types",
  },
];

export function QuizNavbar() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const isSmScreen = useMediaQuery("(min-width: 640px)");

  if (isSmScreen) return <InnerQuizNavbar />;

  return (
    <>
      <Button
        onClick={() => setSheetOpen(!sheetOpen)}
        variant={"outline"}
        className="p-2 gap-2 mt-1 -ml-2 text-primary sm:hidden"
      >
        <SquareMenu className="size-6" /> <span className="text-lg">Menu</span>
      </Button>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTitle></SheetTitle>
        <SheetContent aria-describedby={undefined} side="left">
          <InnerQuizNavbar />
        </SheetContent>
      </Sheet>
    </>
  );
}

function InnerQuizNavbar() {
  const pathname = usePathname();
  return (
    <Card className="flex-1 mt-8 sm:mt-0">
      <CardContent>
        <div className="">
          {menu.map((item, i) => (
            <a
              href={item.href}
              key={i}
              className={`py-4 inline-block w-full hover:text-blue-500 border-b border-muted-foreground ${
                pathname === item.href ? "font-semibold" : ""
              }`}
            >
              {item.title}
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
