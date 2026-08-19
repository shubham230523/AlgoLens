# Merge Sort & Enhanced Animation Implementation Plan

This plan aims to implement the **Merge Sort** algorithm and upgrade the visualization engine to support complex divide-and-conquer animations, inspired by the high-quality HackerEarth visualizer.

## Goal
Add Merge Sort with accurate step generation and enhance the `ArrayVisualizer` to support subarray highlighting and vertical offsets for "merging" effects.

## Proposed Changes

### 1. Type Extensions

#### [algorithm.ts](file:///C:/Users/shubham/Documents/ReactNative/AlgoLens/src/types/algorithm.ts)
- Add `SUBARRAY_FOCUS` to `VisualizationEventType` to represent the "Divide" phase.
- Add `MERGE_STEP` to represent the "Combine" phase.

### 2. New Algorithm Implementation

#### [NEW] [mergeSort.ts](file:///C:/Users/shubham/Documents/ReactNative/AlgoLens/src/algorithms/sorting/mergeSort.ts)
- Implement recursive `mergeSort` with a `generateSteps` wrapper.
- Ensure steps include recursive depth and subarray bounds to guide the visualizer.

#### [index.ts](file:///C:/Users/shubham/Documents/ReactNative/AlgoLens/src/algorithms/index.ts)
- Register `mergeSort` in the library.

### 3. Visualization Engine Upgrades

#### [ArrayVisualizer.tsx](file:///C:/Users/shubham/Documents/ReactNative/AlgoLens/src/components/visualization/ArrayVisualizer.tsx)
- **Subarray Highlighting**: Dim elements that are NOT part of the current active subarray.
- **Vertical Offsets**: Use `useAnimatedStyle` to shift merging elements vertically to create a "temporary array" effect during the combining phase.
- **Improved Labels**: Show range labels (e.g., `left`, `mid`, `right`) during merge steps.

---

## Verification Plan

### Automated Tests
- `npm run lint`: Check for code style.
- Unit test for `mergeSort.generateSteps` to ensure the final state is always sorted.

### Manual Verification
- **Merge Sort Walkthrough**: Step through Merge Sort and verify that the "Divide" phase correctly highlights smaller segments.
- **Merging Check**: Verify that elements appear to "move" or transform clearly when being combined back into the sorted array.
- **Performance**: Ensure the new vertical animations don't cause lag on larger arrays.
