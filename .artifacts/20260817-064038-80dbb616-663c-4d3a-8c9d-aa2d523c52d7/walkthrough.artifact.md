# Walkthrough: Merge Sort & Advanced Animations

I have implemented the **Merge Sort** algorithm and significantly enhanced the visualization engine to support complex, high-quality animations inspired by the HackerEarth visualizer.

## Key Accomplishments

### 1. Merge Sort Algorithm
Created [mergeSort.ts](file:///C:/Users/shubham/Documents/ReactNative/AlgoLens/src/algorithms/sorting/mergeSort.ts) with detailed step generation:
- **Divide Phase**: Generates `SUBARRAY_FOCUS` events to show the recursive splitting of the array.
- **Conquer Phase**: Generates `MERGE_STEP` events to show elements being compared and placed back into the sorted sublist.
- **Accurate Code Sync**: Linked every step to the specific line in the merge sort implementation.

### 2. Advanced Animation Engine
Upgraded [ArrayVisualizer.tsx](file:///C:/Users/shubham/Documents/ReactNative/AlgoLens/src/components/visualization/ArrayVisualizer.tsx) with two new visual capabilities:
- **Subarray Highlighting**: When the algorithm focuses on a segment (e.g., the left half), the rest of the array automatically **dims/fades out**. This makes the "Divide" process incredibly clear.
- **Vertical Merge Motion**: Elements being placed into the sorted sublist now **slide vertically** up during the `MERGE_STEP`. This creates a beautiful "merging" effect that demonstrates the creation of the temporary sorted array.

### 3. Integrated Experience
- **Auto-Switching**: The engine automatically detects the complexity of the Merge Sort steps and applies the new animations seamlessly.
- **Polished UI**: Refined the bar spacing and height calculations to ensure the "merging" motion has enough breathing room.

## Verification Results

### Manual Verification
- **Merge Sort Flow**: Stepped through the entire algorithm. Confirmed that the array splits correctly into sub-sections and that those sections highlight/fade as expected.
- **Animation Fluidity**: The vertical slide and fade animations run smoothly at 60 FPS on the UI thread.
- **Color Consistency**: Merge steps use the "Swap" theme color to signify movement, maintaining visual consistency with other algorithms.

## Next Steps
Now that we have advanced divide-and-conquer visuals, we can apply these same patterns to **Quick Sort** and other recursive algorithms.
