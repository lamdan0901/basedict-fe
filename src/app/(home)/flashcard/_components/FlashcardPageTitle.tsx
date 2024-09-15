"use client";

import { usePathname } from "next/navigation";

const pathnameMap: Record<string, string> = {
  "/flashcard": "Khám phá Flashcard",
  "/flashcard/search": "Tìm kiếm Flashcard",
  "/flashcard/my-flashcard": "Flashcard của tôi",
};

export function FlashcardPageTitle() {
  const pathname = usePathname();

  return (
    <h1 className="sm:text-3xl mb-4 text-center text-2xl ml-2 font-bold">
      {pathnameMap[pathname] ?? "Flashcard"}
    </h1>
  );
}
