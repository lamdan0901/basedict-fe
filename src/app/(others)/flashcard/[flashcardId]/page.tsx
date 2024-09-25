import { createClient } from "@/utils/supabase/server";
import { FlashcardDetail } from "@/modules/flashcard/detail";
import { ResolvingMetadata } from "next";
import { cache } from "react";

const fetchFlashcardSet = cache(async (flashcardId?: string) => {
  if (!flashcardId) return null;

  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) return undefined;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/v1/flash-card-sets/${flashcardId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 5 }, // caching for 5 secs
      }
    );
    if (!res.ok) return;
    const data = await res.json();
    return data.data as TFlashcardSet;
  } catch (err: any) {
    console.log("err fetchFlashcardSet: ", err);
  }
});

export async function generateMetadata(
  { params }: TComponentProps,
  parent: ResolvingMetadata
) {
  const [flashcardSet, previousMeta] = await Promise.all([
    fetchFlashcardSet(params.flashcardId),
    parent,
  ]);

  if (!flashcardSet) return previousMeta;

  return {
    ...previousMeta,
    title: `BaseDict | Flashcards Tiếng Nhật. ${flashcardSet.title}`,
    description: flashcardSet.description,
  };
}

export default async function FlashcardViewPage({ params }: TComponentProps) {
  const flashcardSet = await fetchFlashcardSet(params.flashcardId);
  return <FlashcardDetail flashcardSet={flashcardSet} />;
}
