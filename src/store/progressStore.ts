import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Platform } from 'react-native';

interface UserProgress {
  viewedAlgorithms: string[]; // array of IDs
  completedAlgorithms: string[];
  favorites: string[];
  streak: number;
  lastActive: string; // ISO date
}

interface ProgressState extends UserProgress {
  markViewed: (id: string) => void;
  toggleFavorite: (id: string) => void;
  completeAlgorithm: (id: string) => void;
  isFavorite: (id: string) => boolean;
  isCompleted: (id: string) => boolean;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      viewedAlgorithms: [],
      completedAlgorithms: [],
      favorites: [],
      streak: 0,
      lastActive: new Date().toISOString(),

      markViewed: (id) => set((state) => ({
        viewedAlgorithms: state.viewedAlgorithms.includes(id)
          ? state.viewedAlgorithms
          : [...state.viewedAlgorithms, id],
        lastActive: new Date().toISOString(),
      })),

      toggleFavorite: (id) => set((state) => ({
        favorites: state.favorites.includes(id)
          ? state.favorites.filter(fav => fav !== id)
          : [...state.favorites, id]
      })),

      completeAlgorithm: (id) => set((state) => ({
        completedAlgorithms: state.completedAlgorithms.includes(id)
          ? state.completedAlgorithms
          : [...state.completedAlgorithms, id]
      })),

      isFavorite: (id) => get().favorites.includes(id),
      isCompleted: (id) => get().completedAlgorithms.includes(id),
    }),
    {
      name: 'algolens-progress',
      storage: createJSONStorage(() => {
        if (Platform.OS === 'web') return window.localStorage;

        // Use a persistent memory object to avoid Native Module crashes
        const memoryCache = new Map<string, string>();
        return {
          getItem: (name: string) => memoryCache.get(name) || null,
          setItem: (name: string, value: string) => { memoryCache.set(name, value); },
          removeItem: (name: string) => { memoryCache.delete(name); },
        } as any;
      }),
    }
  )
);
