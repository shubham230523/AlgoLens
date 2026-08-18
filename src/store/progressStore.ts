import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
