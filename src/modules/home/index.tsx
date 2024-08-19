"use client";

import { MEANING_ERR_MSG } from "@/constants";
import { trimAllSpaces } from "@/lib";
import { GrammarSection } from "@/modules/home/GrammarSection";
import { LexemeSearch } from "@/modules/home/LexemeSearch";
import { MeaningSection } from "@/modules/home/MeaningSection";
import { TranslationPopup } from "@/components/TranslationPopup";
import { getRequest, postRequest } from "@/service/data";
import { useLexemeStore } from "@/store/useLexemeStore";
import { GRAMMAR_CHAR } from "@/constants";
import useSWRImmutable from "swr/immutable";
import useSWRMutation from "swr/mutation";
import { SimilarWords } from "@/modules/home/LexemeSearch/SimilarWords";
import { TranslatedParagraph } from "@/modules/home/TranslatedParagraph";

export function Home() {
  const { text, word, selectedVocab, selectedGrammar, setVocabMeaningErrMsg } =
    useLexemeStore();

  const isParagraphMode = text.length >= 20;
  const isVocabMode = !isParagraphMode && !text.startsWith(GRAMMAR_CHAR);
  const isGrammarMode =
    !isParagraphMode && text.length >= 1 && text.startsWith(GRAMMAR_CHAR);

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
    }
  );
  const {
    trigger: translateParagraph,
    isMutating: translatingParagraph,
    error,
  } = useSWRMutation("/v1/paragraphs/translate", postRequest);

  return (
    <TranslationPopup>
      <div className="py-4 gap-4 sm:flex-row flex-col flex">
        <div className="w-full space-y-4">
          <LexemeSearch
            translateParagraph={translateParagraph}
            lexemeSearch={lexemeSearch}
          />
          <SimilarWords
            similars={
              lexemeSearch?.similars ||
              selectedVocab?.similars ||
              selectedGrammar?.similars
            }
          />
        </div>
        {isVocabMode && (
          <MeaningSection
            lexemeSearch={lexemeSearch}
            loadingLexemeSearch={loadingLexemeSearch}
            retryLexemeSearch={retryLexemeSearch}
            wordIdToReport={lexemeSearch?.id || selectedVocab?.id || ""}
          />
        )}
        {isGrammarMode && <GrammarSection />}
        {isParagraphMode && (
          <TranslatedParagraph error={error} isLoading={translatingParagraph} />
        )}
      </div>
    </TranslationPopup>
  );
}
