import { Badge } from "@/components/ui/badge";
import { useLexemeStore } from "@/store/useLexemeStore";
import { GRAMMAR_CHAR } from "@/constants";
import { useUrlSearchParams } from "@/hooks/useUrlSearchParams";

export function SimilarWords({
  similars,
}: {
  similars: string[] | undefined | null;
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
    setText(word);

    if (!text.startsWith(GRAMMAR_CHAR)) {
      setWord(word);
      setVocabMeaningErrMsg("");
      setSelectedVocab(null);
    } else {
      setSelectedGrammar(null);
      setSearchParam({ search: word });
    }
  }

  return (
    <div className="flex gap-2 sm:max-w-[50%] flex-wrap">
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
