import { createClient } from "@/utils/supabase/server";
import { FlashcardDetail } from "@/modules/flashcard/detail";
import { createFlashcardRepository } from "@/lib/supabase/repositories/flashcardRepo";
import { ResolvingMetadata } from "next";

export async function generateMetadata(
  { params }: TComponentProps,
  parent: ResolvingMetadata
) {
  if (!params.flashcardId) return parent;

  const supabase = createClient();
  const repo = createFlashcardRepository(supabase);

  const [flashcardSet, previousMeta] = await Promise.all([
    repo.getFlashcardSetById(params.flashcardId).catch(() => null),
    parent,
  ]);

  if (!flashcardSet) return previousMeta;

  return {
    ...previousMeta,
    title: `BaseDict | Flashcards Tiếng Nhật. ${flashcardSet.title}`,
    description: flashcardSet.description,
  };
}

export default function FlashcardDetailPage() {
  return <FlashcardDetail />;
}
