import { combine } from "zustand/middleware";
import { createWithEqualityFn as create } from "zustand/traditional";

export const useLexemeStore = create(
  combine(
    {
      text: "",
      word: "", // for vocab
      vocabMeaningErrMsg: "",
      selectedVocab: null as TLexeme | null,
      selectedGrammar: null as TGrammar | null,
      translatedParagraph: null as TTranslatedParagraph | null,
      isTranslatingParagraph: false,
    },
    (set) => ({
      setText: (text: string) => set({ text }),
      setWord: (word: string) => set({ word }),
      setVocabMeaningErrMsg: (msg: string) => set({ vocabMeaningErrMsg: msg }),
      setSelectedVocab: (vocab: TLexeme | null) =>
        set({ selectedVocab: vocab }),
      setSelectedGrammar: (grammar: TGrammar | null) =>
        set({ selectedGrammar: grammar }),
      setTranslatedParagraph: (p: TTranslatedParagraph | null) =>
        set({ translatedParagraph: p }),
      setIsTranslatingParagraph: (isTranslating: boolean) =>
        set({ isTranslatingParagraph: isTranslating }),
    })
  )
);

export const useVnToJpTransStore = create(
  combine(
    {
      searchText: "",
      isTranslatingParagraph: false,
    },
    (set) => ({
      setSearchText: (searchText: string) => set({ searchText }),
      setIsTranslatingParagraph: (isTranslating: boolean) =>
        set({ isTranslatingParagraph: isTranslating }),
    })
  )
);
