import { Badge } from "@/components/ui/badge";
import { useLexemeStore } from "@/store/useLexemeStore";
import { GRAMMAR_CHAR } from "@/constants";
import { useUrlSearchParams } from "@/hooks/useUrlSearchParams";

export function SimilarWords({
  similars,
  onWordClick,
}: {
  similars: string[] | undefined | null;
  onWordClick: () => void;
}) {
  const setSearchParam = useUrlSearchParams();
  const {
    text,
    setText,
    setSelectedVocab,
    setSelectedGrammar,
    setWord,
    setVocabMeaningErrMsg,
  } = useLexemeStore();

  if (!similars?.length) return null;

  function handleWordClick(word: string) {
    setSearchParam({ search: word });
    setText(word);
    onWordClick();

    if (!text.startsWith(GRAMMAR_CHAR)) {
      setWord(word);
      setVocabMeaningErrMsg("");
      setSelectedVocab(null);
    } else {
      setSelectedGrammar(null);
    }
  }

  return (
    <div className="flex gap-2 px-4 h-fit flex-wrap">
      <p className="text-base sm:text-lg">Từ tương tự:</p>
      {similars?.map((word, i) => (
        <Badge
          className="cursor-pointer text-sm sm:text-base"
          onClick={() => handleWordClick(word)}
          key={i}
        >
          {word}
        </Badge>
      ))}
    </div>
  );
}
