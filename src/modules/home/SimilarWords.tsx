import { useLexemeStore } from "@/store/useLexemeStore";
import { GRAMMAR_CHAR } from "@/constants";
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

  return <SimilarLexemes similars={similars} onWordClick={handleWordClick} />;
}
