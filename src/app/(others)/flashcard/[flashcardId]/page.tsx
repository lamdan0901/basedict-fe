import { createClient } from "@/utils/supabase/server";
import { FlashcardDetail } from "@/modules/flashcard/detail";
import { ResolvingMetadata } from "next";

const fetchFlashcardSet = async (flashcardId?: string) => {
  if (!flashcardId) return null;

  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/v1/flash-card-sets/${flashcardId}`,
      {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      }
    );
    if (!res.ok) return;
    const data = await res.json();
    return data.data as TFlashcardSet;
  } catch (err: any) {
    console.log("err fetchFlashcardSet: ", err);
  }
};

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

export default function FlashcardViewPage() {
  return <FlashcardDetail />;
}
