"use client";

import { MEANING_ERR_MSG } from "@/constants";
import { trimAllSpaces } from "@/lib";
import { LexemeSearch } from "@/modules/home/LexemeSearch";
import { MeaningSection } from "@/modules/home/MeaningSection";
import { TranslationPopup } from "@/modules/home/TranslationPopup";
import { getRequest } from "@/service/data";
import { useState } from "react";
import useSWRImmutable from "swr/immutable";

export function Home() {
  const [word, setWord] = useState("");
  const [meaningErrMsg, setMeaningErrMsg] = useState("");
  const [selectedLexeme, setSelectedLexeme] = useState<TLexeme | null>(null);

  const {
    data: lexemeSearch,
    isLoading: loadingLexemeSearch,
    mutate: retryLexemeSearch,
  } = useSWRImmutable<TLexeme>(
    word ? `/v1/lexemes/search/${trimAllSpaces(word)}` : null,
    getRequest,
    {
      onError(errMsg) {
        setMeaningErrMsg(
          MEANING_ERR_MSG[errMsg as keyof typeof MEANING_ERR_MSG] ??
            MEANING_ERR_MSG.UNKNOWN
        );
        console.error("err searching lexeme: ", errMsg);
      },
    }
  );

  console.log("render...");

  return (
    <TranslationPopup>
      <div className="flex h-full  py-4 sm:flex-row flex-col gap-8 items-start">
        <LexemeSearch
          selectedLexeme={selectedLexeme}
          lexemeSearch={lexemeSearch}
          setMeaningErrMsg={setMeaningErrMsg}
          setWord={setWord}
          setSelectedLexeme={setSelectedLexeme}
        />
        <MeaningSection
          lexemeSearch={lexemeSearch}
          loadingLexemeSearch={loadingLexemeSearch}
          retryLexemeSearch={retryLexemeSearch}
          meaningErrMsg={meaningErrMsg}
          wordIdToReport={lexemeSearch?.id || selectedLexeme?.id || ""}
        />
      </div>
    </TranslationPopup>
  );
}
