import { UserFlashcard } from "@/modules/flashcard/user-flashcard";
import { ResolvingMetadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { createFlashcardRepository } from "@/lib/supabase/repositories/flashcardRepo";

export async function generateMetadata(
  { params }: TComponentProps,
  parent: ResolvingMetadata
) {
  const previousMeta = await parent;
  if (!params.userId) return previousMeta;

  const supabase = createClient();
  const flashcardRepo = createFlashcardRepository(supabase);
  const owner = await flashcardRepo
    .getUserFlashcardSets(params.userId)
    .catch(() => null);

  if (!owner) return previousMeta;

  return {
    ...previousMeta,
    title: `BaseDict | Flashcards Tiếng Nhật. Bộ flashCard của ${owner.name}`,
    description: `Danh sách các bộ flashCard của ${owner.name}`,
    keyword: "flashcard tiếng Nhật",
  };
}

export default async function UserFlashcardPage({ params }: TComponentProps) {
  if (!params.userId) return null;

  const supabase = createClient();
  const flashcardRepo = createFlashcardRepository(supabase);
  const owner = await flashcardRepo
    .getUserFlashcardSets(params.userId)
    .catch(() => undefined);

  return <UserFlashcard owner={owner} />;
}
