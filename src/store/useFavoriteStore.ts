import { MAX_FAVORITE_ITEMS } from "@/constants";
import { TFavoriteItem } from "@/interface/history";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface IFavoriteState {
  favoriteItems: TFavoriteItem[];
  addFavoriteItem: (item: TFavoriteItem) => void;
  removeFavoriteItem: (id?: string) => void;
  clearFavorite: () => void;
  isFavoriteItem: (id?: string) => boolean;
}

export const useFavoriteStore = create<IFavoriteState>()(
  persist(
    immer((set, get) => ({
      favoriteItems: [],
      addFavoriteItem: (item) => {
        set((state) => {
          if (state.favoriteItems.length >= MAX_FAVORITE_ITEMS) {
            state.favoriteItems.pop();
          }
          state.favoriteItems.unshift(item);
        });
      },
      removeFavoriteItem: (id) => {
        set((state) => {
          state.favoriteItems = state.favoriteItems.filter(
            (item) => item.id !== id
          );
        });
      },
      clearFavorite: () => set({ favoriteItems: [] }),
      isFavoriteItem: (id) => {
        return get().favoriteItems.some((item) => item.id === id);
      },
    })),
    {
      name: "favorite",
    }
  )
);
