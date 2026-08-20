# Resizable Columns in Visualizer

This plan outlines the implementation of horizontal resizing for the three-column layout in the Visualizer screen.

## Proposed Changes

### 1. Width Management
- Introduce state or shared values to track the widths of the Code Section and AI Tutor Section.
- Set minimum and maximum width constraints to maintain usability.

### 2. Resizer Handles
- Add two vertical resizer components (Handle 1 and Handle 2) between the columns.
- Style the handles to be visible but subtle, with a `col-resize` cursor on web.

### 3. Gesture Logic
- Implement drag functionality to update column widths in real-time.
- Ensure the center Visualization section automatically takes up the remaining space.

#### [[id].tsx](file:///C:/Users/shubham/Documents/ReactNative/AlgoLens/src/app/visualizer/[id].tsx)
- Add `codeWidth` and `aiWidth` states.
- Insert `Pressable` or `View` components with pan handlers between the main sections.
- Update styles to use the dynamic width states.

## Verification Plan

### Automated Verification
- `analyze_file` on `VisualizerScreen` to check for syntax and type errors.

### Manual Verification
- **Resize Code Section**: Drag the left handle and verify the Code Editor expands/contracts correctly.
- **Resize AI Section**: Drag the right handle and verify the AI Sidebar expands/contracts correctly.
- **Center Section**: Verify the Visualization section adjusts its width to fill the gap.
- **Constraints**: Ensure the columns don't shrink below a usable minimum size (e.g., 200px).
