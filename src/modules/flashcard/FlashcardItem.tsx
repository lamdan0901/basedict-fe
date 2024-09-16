import { Card, CardContent } from "@/components/ui/card";
import { DEFAULT_AVATAR_URL } from "@/constants";
import { CheckCheck, GraduationCap, Clock } from "lucide-react";
import Image from "next/image";

export function FlashcardItem({
  card,
  hiddenDate,
}: {
  card: TFlashCard;
  hiddenDate?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-2 hover:shadow-lg transition duration-300 sm:p-4">
        <div className="flex justify-between">
          <h2 className="font-semibold text-lg">{card.title}</h2>
          <div className="bg-slate-50 text-black rounded-full px-6 pt-1 text-sm border">
            {card.flashCardNumber} thẻ
          </div>
        </div>

        <p className="line-clamp-2 text-xs mt-2 mb-3">{card.description}</p>

        <div className="flex justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Image
              src={card.owner.avatar || DEFAULT_AVATAR_URL}
              width={40}
              height={40}
              className="rounded-full size-10 object-cover shrink-0"
              alt="owner-avatar"
            />
            <span>{card.owner.name}</span>
          </div>
          <div className="flex gap-3">
            <div className="flex gap-1 items-center text-xs">
              <GraduationCap className="size-5" />
              <span>{card.learnedNumber} người</span>
            </div>
            <div className="flex gap-1 items-center text-xs">
              <CheckCheck className="size-5" />
              <span>{card.learningNumber} lượt</span>
            </div>
            {!hiddenDate && (
              <div className="flex gap-1 items-center text-xs">
                <Clock className="size-5" />
                <span>{new Date(card.updatedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
