import { MAX_FAVORITE_ITEMS } from "@/shared/constants";
import { TFavoriteItem } from "@/interface/history";
import { create } from "zustand";
import { persist, combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const useFavoriteStore = create(
  persist(
    immer(
      combine({ favoriteItems: [] as TFavoriteItem[] }, (set, get) => ({
        addFavoriteItem: (item: TFavoriteItem) => {
          set((state) => {
            if (state.favoriteItems.length >= MAX_FAVORITE_ITEMS) {
              state.favoriteItems = [item, ...state.favoriteItems.slice(0, -1)];
            } else {
              state.favoriteItems = [item, ...state.favoriteItems];
            }
          });
        },
        removeFavoriteItem: (id?: string) => {
          set((state) => {
            state.favoriteItems = state.favoriteItems.filter(
              (item) => item.id !== id
            );
          });
        },
        clearFavorite: () =>
          set((state) => {
            state.favoriteItems = [];
          }),
        isFavoriteItem: (id?: string) => {
          return get().favoriteItems.some((item) => item.id === id);
        },
      }))
    ),
    {
      name: "favorite",
    }
  )
);
