import { create } from 'zustand';
import { VisualizationEvent } from '@/types/algorithm';

interface PlaybackState {
  // Data
  steps: VisualizationEvent[];
  currentStepIndex: number;

  // Playback Control
  isPlaying: boolean;
  playbackSpeed: number; // multiplier (e.g., 1, 1.5, 2)

  // Actions
  setSteps: (steps: VisualizationEvent[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  jumpToStep: (index: number) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
}

export const usePlaybackStore = create<PlaybackState>((set, get) => ({
  steps: [],
  currentStepIndex: -1,
  isPlaying: false,
  playbackSpeed: 1,

  setSteps: (steps) => set({ steps, currentStepIndex: -1, isPlaying: false }),

  nextStep: () => set((state) => ({
    currentStepIndex: Math.min(state.currentStepIndex + 1, state.steps.length - 1)
  })),

  prevStep: () => set((state) => ({
    currentStepIndex: Math.max(state.currentStepIndex - 1, -1)
  })),

  jumpToStep: (index) => set((state) => ({
    currentStepIndex: Math.max(-1, Math.min(index, state.steps.length - 1))
  })),

  play: () => set({ isPlaying: true }),

  pause: () => set({ isPlaying: false }),

  reset: () => set({ currentStepIndex: -1, isPlaying: false }),

  setSpeed: (speed) => set({ playbackSpeed: speed }),
}));
