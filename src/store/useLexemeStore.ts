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
  translatedParagraph: string;
  setTranslatedParagraph: (text: string) => void;
}

export const useLexemeStore = create<ILexemeStore>()((set) => ({
  text: "",
  setText: (text: string) => set({ text }),
  word: "",
  setWord: (word: string) => set({ word }),
  vocabMeaningErrMsg: "",
  setVocabMeaningErrMsg: (msg: string) => set({ vocabMeaningErrMsg: msg }),
  selectedVocab: null,
  setSelectedVocab: (vocab: TLexeme | null) => set({ selectedVocab: vocab }),
  selectedGrammar: null,
  setSelectedGrammar: (grammar: TGrammar | null) =>
    set({ selectedGrammar: grammar }),
  translatedParagraph: "",
  setTranslatedParagraph: (text: string) => set({ translatedParagraph: text }),
}));
