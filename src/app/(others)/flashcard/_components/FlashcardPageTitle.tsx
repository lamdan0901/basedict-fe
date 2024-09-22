"use client";

import { usePathname } from "next/navigation";

const pathnameMap: Record<string, string> = {
  "/flashcard": "Khám phá Flashcard",
  "/flashcard/search": "Tìm kiếm Flashcard",
  "/flashcard/my-flashcard": "Flashcard của tôi",
  "/flashcard/create": "Tạo bộ Flashcard",
};

export function FlashcardPageTitle() {
  const pathname = usePathname();
  const flashcardTitle = pathname.startsWith("/flashcard/update")
    ? "Chỉnh sửa bộ Flashcard"
    : pathnameMap[pathname] ?? "Flashcard";

  return (
    <h1 className="sm:text-3xl mb-4 text-center text-2xl ml-2 font-bold">
      {flashcardTitle}
    </h1>
  );
}
