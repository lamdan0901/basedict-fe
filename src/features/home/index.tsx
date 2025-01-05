"use client";

import { AdSense } from "@/components/ui/ad";
import { HistoryNFavorite } from "@/shared/ui";
import { TodaysTopic } from "@/features/home/TodaysTopic";
import { TopFlashcardSets } from "@/features/home/TopFlashcards";
import { TranslationSection } from "@/features/home/TranslationSection";

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
