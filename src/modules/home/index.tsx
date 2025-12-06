"use client";

import { HistoryNFavorite } from "@/components/HistoryNFavorite";
import { TopFlashcardSets } from "@/modules/home/TopFlashcards";
import { TranslationSection } from "@/modules/home/TranslationSection";

type Props = {
  _lexemeSearch: TLexeme | undefined;
};

export function Home({ _lexemeSearch }: Props) {
  return (
    <>
      <TranslationSection _lexemeSearch={_lexemeSearch} />
      <HistoryNFavorite />
      <TopFlashcardSets />
    </>
  );
}
