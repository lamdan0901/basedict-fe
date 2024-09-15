"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  const isLgScreen = useMediaQuery("(min-width: 1024px)");

  if (isLgScreen) return <InnerQuizNavbar />;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant={"outline"}
          className="p-2 gap-2 sm:absolute top-[194px] left-[12px] static lg:order-1 order-2 mt-1 text-primary"
        >
          <SquareMenu className="size-6" />{" "}
          <span className="text-lg">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetTitle></SheetTitle>
      <SheetContent aria-describedby={undefined} side="left">
        <InnerQuizNavbar />
      </SheetContent>
    </Sheet>
  );
}

function InnerQuizNavbar() {
  const pathname = usePathname();

  return (
    <Card className="flex-1 mt-8 lg:mt-0">
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
