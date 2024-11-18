import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { matchingOptions } from "@/modules/flashcard/const";
import { CircleArrowLeft } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useUrlSearchParams } from "@/hooks/useUrlSearchParams";

type Props = {
  option: string;
  flashCardsLength: number;
  restart: () => void;
};

export function OptionsSelector({ option, flashCardsLength, restart }: Props) {
  const router = useRouter();
  const setSearchParam = useUrlSearchParams();

  return (
    <div className="flex gap-2 sm:flex-row flex-col justify-between mb-2 items-start sm:items-center">
      <Button variant={"outline"} onClick={() => router.back()}>
        <CircleArrowLeft className="mr-2 size-5" /> Quay lại
      </Button>
      <div className="flex gap-2 items-center">
        <span>Số lượng flashcard</span>
        <Select
          value={option}
          onValueChange={(option) => {
            restart();
            setSearchParam({
              option,
            });
          }}
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {matchingOptions.map((option) => (
              <SelectItem
                key={option}
                disabled={+option > flashCardsLength}
                value={option}
              >
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
