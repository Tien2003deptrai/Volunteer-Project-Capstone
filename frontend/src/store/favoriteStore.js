import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFavoriteStore = create(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (duty) => {
        const favorites = get().favorites;
        const isExist = favorites.some(fav => fav._id === duty._id);

        if (!isExist) {
          set({ favorites: [...favorites, duty] });
        }
      },

      removeFavorite: (dutyId) => {
        set((state) => ({
          favorites: state.favorites.filter(fav => fav._id !== dutyId)
        }));
      },

      toggleFavorite: (duty) => {
        const favorites = get().favorites;
        const isExist = favorites.some(fav => fav._id === duty._id);

        if (isExist) {
          get().removeFavorite(duty._id);
        } else {
          get().addFavorite(duty);
        }
      },

      isFavorite: (dutyId) => {
        return get().favorites.some(fav => fav._id === dutyId);
      },

      clearFavorites: () => {
        set({ favorites: [] });
      }
    }),
    {
      name: 'favorite-storage',
    }
  )
);

export default useFavoriteStore;

