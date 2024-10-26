import { createWithEqualityFn as create } from "zustand/traditional";

interface IVnToJpTransStore {
  searchText: string;
  setSearchText: (searchText: string) => void;
}

export const useVnToJpTransStore = create<IVnToJpTransStore>()((set) => ({
  searchText: "",
  setSearchText: (searchText) => set(() => ({ searchText })),
}));
