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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib";

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
      <CardContent className="p-2 flex flex-col items-center gap-y-2">
        {menu.map((item, i) => (
          <a className="w-full" href={item.href} key={i}>
            <Button
              className={cn(
                "w-full hover:text-blue-500 ",
                i !== menu.length - 1 && "mb-2",
                item.href === pathname && "text-blue-500 font-semibold"
              )}
              variant={"ghost"}
            >
              {item.title}
            </Button>
            {i !== menu.length - 1 && <Separator />}
          </a>
        ))}
      </CardContent>
    </Card>
  );
}
