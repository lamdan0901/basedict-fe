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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib";
import { ExploreIcon } from "@/components/icons";
import {
  BookText,
  GraduationCap,
  ScrollText,
  Search,
  SquareMenu,
} from "lucide-react";
import { QuizIcon } from "@/components/icons/QuizIcon";
import Link from "next/link";
import { getRequest } from "@/service/data";
import useSWR from "swr";
import { useState } from "react";

const menu = [
  // {
  //   title: "Thông tin chung",
  //   href: "/quizzes/general-info",
  // },
  // {
  //   title: "Luyện thi BaseDict",
  //   href: "/quizzes/basedict-test",
  // },
  // {
  //   title: "Bảng xếp hạng",
  //   href: "/quizzes/ranking",
  // },
  {
    title: "Khám phá",
    href: "/quizzes",
    icon: <ExploreIcon />,
  },
  {
    title: "Tìm kiếm đề thi",
    href: "/quizzes/search",
    icon: <Search className="size-6" />,
  },
  {
    title: "Làm đề JLPT",
    href: "/quizzes/jlpt-test",
    icon: <QuizIcon />,
  },
  {
    title: "Đề thi của tôi",
    href: "/quizzes/my-quizzes",
    icon: <BookText className="size-6" />,
    withSubItems: true,
  },
  {
    title: "Đề thi đang làm",
    href: "/quizzes/my-quizzes",
    icon: <GraduationCap className="size-6" />,
    withSubItems: true,
  },
  {
    title: "Các dạng bài đề thi JLPT",
    icon: <ScrollText className="size-6" />,
    href: "/quizzes/jlpt-question-types",
  },
];

export function QuizNavbar() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const isLgScreen = useMediaQuery("(min-width: 1024px)");

  if (isLgScreen) return <InnerQuizNavbar />;

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button
          variant={"outline"}
          className="p-2 sm:w-fit gap-2 lg:order-1 order-2 mt-1 text-primary"
        >
          <SquareMenu className="size-6" />{" "}
          <span className="text-lg">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetTitle></SheetTitle>
      <SheetContent
        className="bg-gray-50"
        aria-describedby={undefined}
        side="left"
      >
        <InnerQuizNavbar onMenuItemClick={() => setSheetOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

function InnerQuizNavbar({
  onMenuItemClick,
}: {
  onMenuItemClick?: () => void;
}) {
  const pathname = usePathname();

  const { data: myQuiz } = useSWR<TMyQuiz>(`/v1/exams/my-exams`, getRequest);

  const myExams = myQuiz?.myExams ?? [];
  const learningExams = myQuiz?.learningExams ?? [];

  const quizMap: Record<string, TQuiz[]> = {
    "Đề thi của tôi": myExams,
    "Đề thi đang làm": learningExams,
  };

  return (
    <Card className="mt-8 lg:mt-0">
      <CardContent className="p-2 flex flex-col items-center gap-y-2">
        {menu.map((item, i) => (
          <Link className="w-full" href={item.href} key={i}>
            <Button
              className={cn(
                "w-full justify-start gap-2 hover:text-blue-500 ",
                item.href === pathname && "text-blue-500 font-semibold",
                item.withSubItems && "font-semibold",
                i !== menu.length - 1 && "mb-2"
              )}
              variant={"ghost"}
              onClick={onMenuItemClick}
            >
              {item.icon}
              {item.title}
            </Button>
            {item.withSubItems &&
              quizMap[item.title].map((item) => (
                <Link
                  className="w-full"
                  key={item.id}
                  href={`/quizzes/${item.id}`}
                >
                  <Button
                    className={cn(
                      "w-full block truncate font-normal hover:text-blue-500 ",
                      `/quizzes/${item.id}` === pathname && "text-blue-500"
                    )}
                    variant={"ghost"}
                    onClick={onMenuItemClick}
                  >
                    {item.title} - {item.jlptLevel}
                  </Button>
                </Link>
              ))}
            {i !== menu.length - 1 && <Separator />}
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
