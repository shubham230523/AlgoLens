# UI and Routing Fixes Implementation Plan

This plan addresses several UI glitches and a routing issue reported by the user.

## Goal
Fix header overlapping, text cropping in learning paths, missing horizontal padding for cards, and non-functional card clicks.

## Proposed Changes

### Navigation & Header

#### [app-tabs.web.tsx](file:///C:/Users/shubham/Documents/ReactNative/AlgoLens/src/components/app-tabs.web.tsx)
- **Fix Overlap**: Change `tabListContainer` from `position: 'absolute'` to `position: 'relative'` (or ensure it doesn't float over content if absolute is desired for a specific look).
- **Better Brand Text**: Update "Expo Starter" to "AlgoLens".

#### [_layout.tsx](file:///C:/Users/shubham/Documents/ReactNative/AlgoLens/src/app/_layout.tsx)
- Ensure the main content area has a `paddingTop` if the header is absolute.

### UI Components

#### [LearningPathCard.tsx](file:///C:/Users/shubham/Documents/ReactNative/AlgoLens/src/components/ui/LearningPathCard.tsx)
- **Fix Text Cropping**: Remove fixed `height: 32` from `styles.description` and use `minHeight` or let it flex naturally with `numberOfLines`.

#### [AlgorithmCard.tsx](file:///C:/Users/shubham/Documents/ReactNative/AlgoLens/src/components/ui/AlgorithmCard.tsx)
- **Fix Padding**: Add `paddingHorizontal: Spacing.four` (or similar) to ensure cards have breathing room on the sides.

#### [Card.tsx](file:///C:/Users/shubham/Documents/ReactNative/AlgoLens/src/components/ui/Card.tsx)
- **Fix Routing**: Ensure `onPress` is correctly handled. Verify if `TouchableOpacity` needs `onPress` passed directly.

### Screen Layouts

#### [HomeScreen.tsx](file:///C:/Users/shubham/Documents/ReactNative/AlgoLens/src/app/index.tsx)
- **Fix Padding**: Wrap non-horizontal sections in a View with horizontal padding.
- **Ensure Clickability**: Double check `onPress` handlers for `LearningPathCard` and `AlgorithmCard`.

---

## Verification Plan

### Manual Verification
- **Header Check**: Open the Web version and verify the header no longer crops the AlgoLens logo.
- **Text Check**: Verify "Sorting Master" description is fully visible.
- **Padding Check**: Ensure "Bubble Sort" card has consistent left/right margins.
- **Routing Check**: Click on "Bubble Sort" and a Learning Path to ensure they navigate to the correct screens.
