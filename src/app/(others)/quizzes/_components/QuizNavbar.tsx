"use client";

import { Card, CardContent } from "@/components/ui/card";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  return (
    <Card className=" flex-1">
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
