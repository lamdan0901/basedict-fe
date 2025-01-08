import { useLexemeStore } from "@/features/translation/model/store";
import { useUrlSearchParams } from "@/shared/hooks/useUrlSearchParams";
import { BadgeList } from "@/entities/badge-list";

export function SimilarWords({
  similars,
  onWordClick,
}: {
  similars: string[] | undefined | null;
  onWordClick: () => void;
}) {
  const setSearchParam = useUrlSearchParams();
  const { setText, setSelectedVocab, setWord, setVocabMeaningErrMsg } =
    useLexemeStore();

  function handleWordClick(word: string) {
    onWordClick();
    setSearchParam({ search: word });
    setText(word);
    setWord(word);
    setVocabMeaningErrMsg("");
    setSelectedVocab(null);
  }

  if (!similars?.length) return null;

  return (
    <BadgeList
      title="Từ tương tự:"
      words={similars}
      onWordClick={handleWordClick}
    />
  );
}
