import { FlashcardExploring } from "@/features/flashcard/explore";
import { ResolvingMetadata } from "next";

export async function generateMetadata(_: any, parent: ResolvingMetadata) {
  const previousMeta = await parent;
  return {
    ...previousMeta,
    title: "BaseDict | Flashcards Tiếng Nhật. Khám Phá các bộ flashcard sẵn có",
    description: `Khám phá các bộ flashcards từ vựng và Kanji đa dạng từ cấp độ JLPT N1 đến N5. Luyện từ vựng, ngữ pháp và cải thiện khả năng nhớ lâu với phương pháp hiệu quả.`,
    keywords: `flashcard tiếng Nhật, học kanji, học từ vựng tiếng Nhật, JLPT N1-N5, học hiragana, luyện thi JLPT, học tiếng nhật qua flashCard`,
  };
}

export default function FlashcardExploringPage() {
  return <FlashcardExploring />;
}
