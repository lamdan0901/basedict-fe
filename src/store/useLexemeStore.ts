import { create } from "zustand";

interface ILexemeStore {
  word: string; // for vocab
  setWord: (word: string) => void;
  grammar: string;
  setGrammar: (grammar: string) => void;
  text: string;
  setText: (text: string) => void;
  vocabMeaningErrMsg: string;
  setVocabMeaningErrMsg: (msg: string) => void;
  grammarMeaningErrMsg: string;
  setGrammarMeaningErrMsg: (msg: string) => void;
  selectedVocab: TLexeme | null;
  setSelectedVocab: (vocab: TLexeme | null) => void;
  selectedGrammar: TGrammar | null;
  setSelectedGrammar: (grammar: TGrammar | null) => void;
}

export const useLexemeStore = create<ILexemeStore>()((set) => ({
  text: "",
  setText: (text: string) => set({ text }),
  word: "",
  setWord: (word: string) => set({ word }),
  grammar: "",
  setGrammar: (grammar: string) => set({ grammar }),
  vocabMeaningErrMsg: "",
  setVocabMeaningErrMsg: (msg: string) => set({ vocabMeaningErrMsg: msg }),
  grammarMeaningErrMsg: "",
  setGrammarMeaningErrMsg: (msg: string) => set({ grammarMeaningErrMsg: msg }),
  selectedVocab: null,
  setSelectedVocab: (vocab: TLexeme | null) => set({ selectedVocab: vocab }),
  selectedGrammar: null,
  setSelectedGrammar: (grammar: TGrammar | null) =>
    set({ selectedGrammar: grammar }),
}));
