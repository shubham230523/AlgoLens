# AlgoLens Comprehensive Implementation Plan

This plan outlines the end-to-end development of **AlgoLens**, from foundation to a production-ready educational platform.

## Goal
Build a high-quality, cross-platform (Web, iOS, Android) algorithm visualizer that combines interactive animations, code synchronization, and AI-powered tutoring.

---

## Roadmap

### Milestone 0: Project Foundation
- **Navigation**: Expo Router with a Bottom Tab layout (`Home`, `Explore`, `Favorites`, `Settings`).
- **Theming**: A robust system in `src/constants/theme.ts` with semantic tokens (e.g., `active`, `sorted`, `compare`).
- **Global State**: Zustand for user preferences and playback control.

### Milestone 1: Design System
- **Core Components**: Build themed `Button`, `Card`, `ThemedText`, `Input`, `ProgressBar`, and `Slider` in `src/components/ui/`.
- **Code Block**: Reusable component for syntax-highlighted code.

### Milestone 2: Algorithm Engine
- **Core Architecture**: Define `Algorithm` and `VisualizationEvent` interfaces.
- **Event Generation**: Algorithms must be pure functions that return a sequence of `VisualizationEvent` objects.
- **Testability**: Ensure the engine is independent of React Native.

### Milestone 3: Visualization Engine
- **Playback Controller**: Manage `play`, `pause`, `next`, `previous`, and `speed`.
- **Renderers**: `ArrayVisualizer` and `BarChartVisualizer` components.
- **State Restoration**: Ability to jump to any step by re-calculating state.

### Milestone 4: Algorithm Library
- **Screens**: `Home` (featured/recent) and `Explore` (searchable list with categories).
- **Metadata**: Structured JSON for algorithm descriptions, complexities, and categories.

### Milestone 5: Initial 10 Algorithms
- Sorting: `Bubble`, `Selection`, `Insertion`, `Merge`, `Quick`.
- Searching: `Linear`, `Binary`.
- Data Structures: `Reverse Linked List`, `Stack`, `Queue`.

### Milestone 6: Interactive Input
- **Custom Input**: UI for users to enter their own arrays or parameters.
- **Randomizer**: Settings for size, range, and special cases (e.g., "nearly sorted").

### Milestone 7 & 8: Prediction & Practice
- **Prediction Mode**: Pause visualization to ask "What happens next?".
- **Quiz System**: MCQ and Predict-Output questions based on algorithm states.

### Milestone 9: Progress & History
- **Persistence**: Local storage (MMKV/AsyncStorage) for streaks, completed lessons, and favorites.

### Milestone 10: Backend & Auth (Optional for MVP)
- **Sync**: Cloud synchronization for progress.
- **Backend API**: For sharing custom inputs or global leaderboards.

### Milestone 11: Code Synchronization
- **Sync Logic**: Link `codeLine` in `VisualizationEvent` to active line highlighting in the Code view.

### Milestone 12: AI Tutor
- **Contextual Help**: Send current algorithm state to an LLM to explain "Why did we swap these elements?".

### Milestone 13: Tree & Graph visualizers
- **Advanced Renderers**: SVG/Reanimated nodes and edges for Trees, BSTs, and Graphs.

### Milestone 14: Learning Paths
- **Curated Journeys**: Grouped lessons (e.g., "Sorting Master", "Graph Basics").

### Milestone 15: Offline Mode
- **Content Caching**: Pre-cache all algorithm definitions and static visual assets.

### Milestone 16: Performance
- **Optimization**: Memoization of visualizer components and efficient Reanimated layouts for large datasets.

### Milestone 17: Accessibility
- **Support**: ARIA labels, screen reader support, and "Reduce Motion" settings.

### Milestone 18: Production Hardening
- **Error Boundaries**: Graceful handling of invalid input or engine failures.

### Milestone 19 & 20: Testing & Release
- **Verification**: Unit tests for all algorithms, E2E flows for navigation, and platform-specific release builds.

---

## User Review Required
- **Design Consistency**: The app will default to a "Futuristic Dark" theme. Any objections?
- **Platform Priority**: Should I focus on Web first for faster prototyping, or Mobile (iOS/Android) for the primary feel?

## Verification Plan

### Automated Tests
- `npm run lint`: Ensure style compliance.
- `jest`: Unit tests for each algorithm's `generateSteps` function to ensure correctness.

### Manual Verification
- **Web Verification**: Test responsive layout on Chrome/Safari.
- **Mobile Emulation**: Test haptics and touch targets on iOS/Android emulators.
- **Synchronization Check**: Ensure code highlighting perfectly matches visual steps.
