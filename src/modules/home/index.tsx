"use client";

import { MEANING_ERR_MSG } from "@/constants";
import { trimAllSpaces } from "@/lib";
import { GrammarSection } from "@/modules/home/GrammarSection";
import { LexemeSearch } from "@/modules/home/LexemeSearch";
import { MeaningSection } from "@/modules/home/MeaningSection";
import { TranslationPopup } from "@/modules/home/TranslationPopup";
import { getRequest } from "@/service/data";
import { useLexemeStore } from "@/store/useLexemeStore";
import { GRAMMAR_CHAR } from "@/constants";
import useSWRImmutable from "swr/immutable";
import { SimilarWords } from "@/modules/home/LexemeSearch/SimilarWords";

export function Home() {
  const {
    text,
    word,
    setText,
    selectedVocab,
    setSelectedVocab,
    selectedGrammar,
    setSelectedGrammar,
    setGrammarMeaningErrMsg,
    setWord,
    setGrammar,
    setVocabMeaningErrMsg,
  } = useLexemeStore();

  const isVocabMode = !text.startsWith(GRAMMAR_CHAR);
  const isGrammarMode = text.length > 1 && text.startsWith(GRAMMAR_CHAR);

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

  return (
    <TranslationPopup>
      <div className="flex h-full  py-4 sm:flex-row flex-col gap-8 items-start">
        <LexemeSearch lexemeSearch={lexemeSearch} />
        {isVocabMode && (
          <MeaningSection
            lexemeSearch={lexemeSearch}
            loadingLexemeSearch={loadingLexemeSearch}
            retryLexemeSearch={retryLexemeSearch}
            wordIdToReport={lexemeSearch?.id || selectedVocab?.id || ""}
          />
        )}
        {isGrammarMode && <GrammarSection />}
      </div>
      <SimilarWords
        similars={
          lexemeSearch?.similars ||
          selectedVocab?.similars ||
          selectedGrammar?.similars
        }
        onClick={(selectedSimilarWord) => {
          setText(selectedSimilarWord);

          if (!text.startsWith(GRAMMAR_CHAR)) {
            setWord(selectedSimilarWord);
            setVocabMeaningErrMsg("");
            setSelectedVocab(null);
          } else {
            setGrammar(selectedSimilarWord);
            setGrammarMeaningErrMsg("");
            setSelectedGrammar(null);
          }
        }}
      />
    </TranslationPopup>
  );
}
