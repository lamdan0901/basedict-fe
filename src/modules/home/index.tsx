"use client";

import { AdSense } from "@/components/Ad";
import { HistoryNFavorite } from "@/components/HistoryNFavorite";
import { TodaysTopic } from "@/modules/home/TodaysTopic";
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
      <AdSense slot="horizontal" />
      <TodaysTopic />
    </>
  );
}
