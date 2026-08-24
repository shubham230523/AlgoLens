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

        const memoryStorage: any = {
          getItem: (name: string) => null,
          setItem: (name: string, value: string) => {},
          removeItem: (name: string) => {},
        };

        try {
          // Robustly check for AsyncStorage
          const RNAS = require('@react-native-async-storage/async-storage');
          const storage = RNAS.default || RNAS;
          if (storage && typeof storage.getItem === 'function') {
            return storage;
          }
        } catch (e) {
          console.warn('AsyncStorage unavailable, falling back to memory');
        }

        return memoryStorage;
      }),
    }
  )
);
