import { create } from "zustand";

interface ILexemeStore {
  word: string; // for vocab
  setWord: (word: string) => void;
  text: string;
  setText: (text: string) => void;
  vocabMeaningErrMsg: string;
  setVocabMeaningErrMsg: (msg: string) => void;
  selectedVocab: TLexeme | null;
  setSelectedVocab: (vocab: TLexeme | null) => void;
  selectedGrammar: TGrammar | null;
  setSelectedGrammar: (grammar: TGrammar | null) => void;
  translatedParagraph: TTranslatedParagraph | null;
  setTranslatedParagraph: (p: TTranslatedParagraph | null) => void;
  isTranslatingParagraph: boolean;
  setIsTranslatingParagraph: (isTranslating: boolean) => void;
}

export const useLexemeStore = create<ILexemeStore>()((set) => ({
  text: "",
  setText: (text) => set({ text }),
  word: "",
  setWord: (word) => set({ word }),
  vocabMeaningErrMsg: "",
  setVocabMeaningErrMsg: (msg) => set({ vocabMeaningErrMsg: msg }),
  selectedVocab: null,
  setSelectedVocab: (vocab) => set({ selectedVocab: vocab }),
  selectedGrammar: null,
  setSelectedGrammar: (grammar) => set({ selectedGrammar: grammar }),
  translatedParagraph: null,
  setTranslatedParagraph: (p) => set({ translatedParagraph: p }),
  isTranslatingParagraph: false,
  setIsTranslatingParagraph: (isTranslating) =>
    set({ isTranslatingParagraph: isTranslating }),
}));
