- [x] Milestone 11: Code Synchronization
    - [x] Add `bstSearch` to `ALL_ALGORITHMS` in `src/algorithms/index.ts`
    - [x] Refine `codeLine` mappings in all algorithms
        - [x] `bubbleSort.ts`
        - [x] `selectionSort.ts`
        - [x] `insertionSort.ts`
        - [x] [linearSearch.ts](file:///C:/Users/shubham/Documents/ReactNative/AlgoLens/src/algorithms/searching/linearSearch.ts)
        - [x] `binarySearch.ts`
        - [x] `bstSearch.ts`
    - [x] Improve `CodeViewer.tsx`
        - [x] Add line numbers display
        - [x] Implement auto-scroll to `activeLine`
        - [x] Enhance highlighting style
    - [x] Verify synchronization in the app

- [x] Milestone 12: AI Tutor
    - [x] Research/Create AI Service utility
    - [x] Enhance `AITutorModal.tsx`
        - [x] Improve prompting with better context (code, current event, variables)
        - [x] Add "Suggested Questions" based on state
        - [x] Implement markdown rendering for AI responses
    - [x] Verify AI Tutor interactions

- [x] Milestone 13: Tree & Graph visualizers
    - [x] Update `VisualizerScreen.tsx` to handle `visualizationType`
    - [x] Refine `TreeVisualizer.tsx`
        - [x] Add coordinate calculation for array-based trees
        - [x] Add animations for node highlights
    - [x] Implement Graph Visualizer (Bonus/Foundation)
    - [x] Verify Tree visualization with `bstSearch`

- [x] Milestone 14: Learning Paths
    - [x] Define `LearningPath` data and types in `src/algorithms/learningPaths.ts`
    - [x] Create `LearningPathCard.tsx` component
    - [x] Update `HomeScreen.tsx` to display Learning Paths
    - [x] Create `src/app/path/[id].tsx` path detail screen
    - [x] Verify navigation and linking

- [x] Milestone 15: Offline Mode
    - [x] Create `src/lib/assetManager.ts` for pre-loading resources
    - [x] Update `src/app/_layout.tsx` to handle asset initialization
    - [x] Implement connectivity check and offline fallback in `src/lib/aiService.ts`
    - [x] Update `AITutorModal.tsx` UI for offline status
    - [x] Verify local persistence of progress

- [x] Milestone 16: Performance
    - [x] Optimize `ArrayVisualizer.tsx` with `React.memo` and `useAnimatedStyle`
    - [x] Optimize `TreeVisualizer.tsx` node/edge rendering
    - [x] Implement dynamic scaling for large datasets
    - [x] Verify FPS and re-render counts

- [x] Milestone 17: Accessibility
    - [x] Add accessibility props to `Button.tsx` and `Input.tsx`
    - [x] Implement `accessibilityLabel` for `ArrayVisualizer` and `TreeVisualizer`
    - [x] Add `Reduce Motion` support using `useReducedMotion`
    - [x] Update `PlaybackControls.tsx` with descriptive labels
    - [x] Verify with screen reader and system settings

- [x] Milestone 18: Production Hardening
    - [x] Create `ErrorBoundary.tsx` component
    - [x] Wrap `_layout.tsx` with `ErrorBoundary`
    - [x] Improve input validation in `CustomInputModal.tsx`
    - [x] Add safe data processing in `VisualizerScreen.tsx`
    - [x] Verify error handling and edge cases

- [x] UI and Routing Fixes
    - [x] Fix header overlap in `app-tabs.web.tsx`
    - [x] Fix text cropping in `LearningPathCard.tsx`
    - [x] Add horizontal padding to cards in `HomeScreen.tsx`
    - [x] Fix card routing/click issue
    - [x] Update brand text to "AlgoLens"
