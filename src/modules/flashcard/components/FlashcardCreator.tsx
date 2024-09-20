import { CardIcon } from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";
import { DEFAULT_AVATAR_URL } from "@/constants";
import { CheckCheck, GraduationCap } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function FlashcardCreator({ creator }: { creator: TFlashcardCreator }) {
  const router = useRouter();

  return (
    <Card className="cursor-pointer hover:shadow-lg transition duration-300">
      <CardContent
        onClick={() => router.push(`/flashcard/user/${creator.id}`)}
        className="p-2 space-y-4 sm:p-4"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Image
            src={creator.avatar || DEFAULT_AVATAR_URL}
            width={40}
            height={40}
            className="rounded-full size-10 object-cover shrink-0"
            alt="owner-avatar"
          />
          <span className="font-semibold">{creator.name}</span>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="flex gap-1 items-center text-xs">
            <CardIcon width={20} height={20} />
            <span>{creator.flashCardSetNumber} bộ flashcard</span>
          </div>
          <div
            className="flex gap-1 items-center text-xs"
            title="Số người đã học"
          >
            <GraduationCap className="size-5" />
            <span>{creator.totalLearnedNumber} người</span>
          </div>
          <div
            className="flex gap-1 items-center text-xs"
            title="Số người đang học"
          >
            <CheckCheck className="size-5" />
            <span>{creator.totalLearningNumber} lượt</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
