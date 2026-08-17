# Milestone 17: Accessibility Implementation Plan

This milestone focuses on making **AlgoLens** accessible to all users, including those who rely on assistive technologies like screen readers or prefer reduced motion settings.

## Goal
Enhance the app's accessibility by adding semantic roles, descriptive labels, and motion preferences to all interactive and visual components.

## Proposed Changes

### UI Component Enhancements

#### [Button.tsx](file:///C:/Users/shubham/Documents/ReactNative/AlgoLens/src/components/ui/Button.tsx)
- Add `accessibilityRole="button"`.
- Add `accessibilityLabel` prop and default it to the button title.
- Add `accessibilityState` to reflect `disabled` and `busy` (loading) states.

#### [Input.tsx](file:///C:/Users/shubham/Documents/ReactNative/AlgoLens/src/components/ui/Input.tsx)
- Add `accessibilityRole="search"` or `"text"` based on usage.
- Ensure `accessibilityLabel` is present for all inputs.

### Visualization Accessibility

#### [ArrayVisualizer.tsx](file:///C:/Users/shubham/Documents/ReactNative/AlgoLens/src/components/visualization/ArrayVisualizer.tsx)
- Add `accessibilityRole="image"` or `"summary"` to the container.
- Provide a dynamic `accessibilityLabel` that describes the current state of the array (e.g., "Array of 5 elements: 2, 5, 8, 10, 12. Current focus at indices 0 and 1").
- **Reduce Motion**: Use `useReducedMotion` from `react-native-reanimated` to disable or simplify animations when the user has enabled reduced motion in system settings.

#### [TreeVisualizer.tsx](file:///C:/Users/shubham/Documents/ReactNative/AlgoLens/src/components/visualization/TreeVisualizer.tsx)
- Add descriptive `accessibilityLabel` for the tree structure and current highlights.
- Implement `Reduce Motion` fallbacks.

### Navigation and Controls

#### [PlaybackControls.tsx](file:///C:/Users/shubham/Documents/ReactNative/AlgoLens/src/components/visualization/PlaybackControls.tsx)
- Add specific `accessibilityLabel` for each control (e.g., "Play Algorithm", "Skip to Next Step").
- Add `accessibilityHint` to explain the effect of the buttons.

---

## Verification Plan

### Automated Tests
- `npm run lint`: Ensure code quality.
- Verify that `accessibility` props are correctly passed down in unit tests (if applicable).

### Manual Verification
- **Screen Reader Test**: Enable TalkBack (Android) or VoiceOver (iOS/Web) and navigate through the app. Verify that:
  - All buttons are announced with their correct labels and states.
  - The visualizers provide a meaningful summary of the current step.
- **Reduce Motion Test**: Enable "Reduce Motion" in system settings and verify that animations are simplified or removed, providing a static but clear transition.
- **Contrast Check**: Ensure text and highlight colors meet WCAG AA standards (checked via color picking tool).
