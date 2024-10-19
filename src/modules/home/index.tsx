"use client";

import { HistoryItemType, MEANING_ERR_MSG } from "@/constants";
import { trimAllSpaces } from "@/lib";
import { LexemeSearch } from "@/modules/home/LexemeSearch";
import { MeaningSection } from "@/modules/home/MeaningSection";
import { getRequest, postRequest } from "@/service/data";
import { useLexemeStore } from "@/store/useLexemeStore";
import useSWRImmutable from "swr/immutable";
import useSWRMutation from "swr/mutation";
import { SimilarWords } from "@/modules/home/SimilarWords";
import { TranslatedParagraph } from "@/modules/home/TranslatedParagraph";
import { useHistoryStore } from "@/store/useHistoryStore";
import { v4 as uuid } from "uuid";
import { HistoryNFavorite } from "@/components/HistoryNFavorite";
import { TodaysTopic } from "@/modules/home/TodaysTopic";
import { useCallback, useEffect, useRef, useState } from "react";
import { AdSense } from "@/components/Ad/Ad";
import { PARAGRAPH_MIN_LENGTH } from "@/modules/home/const";
import { TopFlashcardSets } from "@/modules/home/TopFlashcards";

type TLexemeRef = {
  hideSuggestions: () => void;
  translateParagraph: () => Promise<void>;
};

type Props = {
  _lexemeSearch: TLexeme | undefined;
};

export function Home({ _lexemeSearch }: Props) {
  const { text, word, selectedVocab, selectedGrammar, setVocabMeaningErrMsg } =
    useLexemeStore();
  const { addHistoryItem } = useHistoryStore();
  const lexemeRef = useRef<TLexemeRef>(null);
  const [initialLexemeSearch, setInitialLexemeSearch] = useState(_lexemeSearch);
  const [initialLexemeText, setInitialLexemeText] = useState(
    _lexemeSearch?.standard ?? ""
  );

  const isParagraphMode = text.length >= PARAGRAPH_MIN_LENGTH;
  const isVocabMode = !isParagraphMode;

  const {
    data: lexemeSearch,
    isLoading: loadingLexemeSearch,
    mutate: retryLexemeSearch,
  } = useSWRImmutable<TLexeme>(
    word ? `/v1/lexemes/search/${trimAllSpaces(word)}` : null,
    getRequest,
    {
      onError(errMsg) {
        setVocabMeaningErrMsg(
          MEANING_ERR_MSG[errMsg as keyof typeof MEANING_ERR_MSG] ??
            MEANING_ERR_MSG.UNKNOWN
        );
        console.error("err searching lexeme: ", errMsg);
      },
      onSuccess(data) {
        addHistoryItem({
          ...data,
          uid: uuid(),
          type: HistoryItemType.Lexeme,
        });
      },
    }
  );
  const {
    trigger: translateParagraph,
    isMutating: translatingParagraph,
    error,
  } = useSWRMutation("/v1/paragraphs/translate", postRequest);

  const effectiveLexemeSearch = lexemeSearch || initialLexemeSearch;

  const onTranslateParagraph = useCallback(
    () => lexemeRef.current?.translateParagraph(),
    []
  );

  useEffect(() => {
    if (lexemeSearch) {
      setInitialLexemeSearch(undefined);
    }
  }, [lexemeSearch]);

  return (
    <>
      <div className="py-4 gap-4 sm:flex-row flex-col flex">
        <div className="w-full space-y-4">
          <LexemeSearch
            ref={lexemeRef}
            initialText={initialLexemeText}
            translateParagraph={translateParagraph}
            onClearInitialText={() => {
              setInitialLexemeText("");
            }}
            onInputClear={() => {
              if (initialLexemeSearch) {
                setInitialLexemeSearch(undefined);
                setInitialLexemeText("");
              }
            }}
            lexemeSearch={effectiveLexemeSearch}
          />
          <SimilarWords
            similars={
              effectiveLexemeSearch?.similars ||
              selectedVocab?.similars ||
              selectedGrammar?.similars
            }
            onWordClick={() => {
              lexemeRef.current?.hideSuggestions();
            }}
          />
        </div>
        {isVocabMode && (
          <MeaningSection
            lexemeSearch={effectiveLexemeSearch || selectedVocab}
            loadingLexemeSearch={loadingLexemeSearch}
            retryLexemeSearch={retryLexemeSearch}
            wordIdToReport={
              effectiveLexemeSearch?.id || selectedVocab?.id || ""
            }
          />
        )}
        {isParagraphMode && (
          <TranslatedParagraph
            error={error}
            isLoading={translatingParagraph}
            onTranslateParagraph={onTranslateParagraph}
          />
        )}
      </div>

      <HistoryNFavorite />
      <TopFlashcardSets />
      <AdSense slot="horizontal" />
      <TodaysTopic />
    </>
  );
}
