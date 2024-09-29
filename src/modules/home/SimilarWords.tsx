import { useLexemeStore } from "@/store/useLexemeStore";
import { useUrlSearchParams } from "@/hooks/useUrlSearchParams";
import { SimilarLexemes } from "@/components/SimilarLexemes";

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
    onWordClick();
    setSearchParam({ search: word });
    setText(word);
    setWord(word);
    setVocabMeaningErrMsg("");
    setSelectedVocab(null);
  }

  return <SimilarLexemes similars={similars} onWordClick={handleWordClick} />;
}
