import { UserFlashcard } from "@/features/flashcard/user-flashcard";
import { ResolvingMetadata } from "next";

const fetchFlashcardSet = async (userId?: string) => {
  if (!userId) return;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/v1/flash-card-sets/user/${userId}`
    );
    if (!res.ok) return;
    const data = await res.json();
    return data.data as TFlashcardSetOwner;
  } catch (err: any) {
    console.log("err fetchFlashcardSet: ", err);
  }
};

export async function generateMetadata(
  { params }: TComponentProps,
  parent: ResolvingMetadata
) {
  const [owner, previousMeta] = await Promise.all([
    fetchFlashcardSet(params.flashcardId),
    parent,
  ]);

  if (!owner) return previousMeta;

  return {
    ...previousMeta,
    title: `BaseDict | Flashcards Tiếng Nhật. Bộ flashCard của ${owner.name}`,
    description: `Danh sách các bộ flashCard của ${owner.name}`,
    keyword: "flashcard tiếng Nhật",
  };
}

export default async function UserFlashcardPage({ params }: TComponentProps) {
  const owner = await fetchFlashcardSet(params.userId);
  return <UserFlashcard owner={owner} />;
}
