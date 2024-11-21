"use client";

import { usePathname } from "next/navigation";

const pathnameMap: Record<string, string> = {
  "/quizzes": "Khám phá đề thi",
  "/quizzes/search": "Tìm kiếm đề thi",
  "/quizzes/my-quizzes": "Đề thi của tôi",
  "/quizzes/create": "Tạo bộ đề thi",
  "/quizzes/jlpt-test": "Làm đề JLPT",
};

export function QuizPageTitle() {
  const pathname = usePathname();
  const flashcardTitle = pathname.startsWith("/quizzes/update")
    ? "Chỉnh sửa bộ đề thi"
    : pathnameMap[pathname] ?? "";

  return (
    <h1 className="sm:text-3xl mb-4 text-center text-2xl ml-2 font-bold">
      {flashcardTitle}
    </h1>
  );
}
