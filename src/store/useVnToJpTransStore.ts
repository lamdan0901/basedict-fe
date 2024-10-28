import { createWithEqualityFn as create } from "zustand/traditional";

interface IVnToJpTransStore {
  searchText: string;
  setSearchText: (searchText: string) => void;
  isTranslatingParagraph: boolean;
  setIsTranslatingParagraph: (isTranslating: boolean) => void;
}

export const useVnToJpTransStore = create<IVnToJpTransStore>()((set) => ({
  searchText: "",
  setSearchText: (searchText) => set(() => ({ searchText })),
  isTranslatingParagraph: false,
  setIsTranslatingParagraph: (isTranslating) =>
    set({ isTranslatingParagraph: isTranslating }),
}));
