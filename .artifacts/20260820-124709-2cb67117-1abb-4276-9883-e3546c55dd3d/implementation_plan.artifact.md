# AI Integration and Code Editor Refinement

This plan outlines the integration of the OpenRouter API with reasoning capabilities and the visual refinement of the Code Editor dimensions.

## Proposed Changes

### 1. OpenRouter AI Integration
- Replace the mock AI service with real API calls to OpenRouter.
- Implement the requested "reasoning" logic using `nvidia/nemotron-3.5-lightning:free`.
- Maintain conversation history including `reasoning_details` to allow the model to continue its thought process.
- Pass current algorithm context (name, code, visualization state) in the system prompt.

#### [aiService.ts](file:///C:/Users/shubham/Documents/ReactNative/AlgoLens/src/lib/aiService.ts)
- Define `API_KEY` and `BASE_URL`.
- Update `ChatMessage` interface to optionally include `reasoning_details`.
- Rewrite `generateTutorResponse` to perform a `fetch` to OpenRouter.
- Ensure the system prompt is always prepended to the message list for context.

---

### 2. Code Editor Refinement
- Set a predefined width for the code editor that looks good on desktop.
- Ensure no code wrapping occurs.
- Enable horizontal scrolling only up to the end of the longest line.

#### [[id].tsx](file:///C:/Users/shubham/Documents/ReactNative/AlgoLens/src/app/visualizer/[id].tsx)
- Update `desktopCodeSection` style to use a specific `width` or `flex` value that results in a fixed width (e.g., 400px or `flex: 0.3`).

#### [CodeViewer.tsx](file:///C:/Users/shubham/Documents/ReactNative/AlgoLens/src/components/visualization/CodeViewer.tsx)
- Double-check `wrapLines={false}` and `whiteSpace: 'pre'`.
- Ensure the inner `ScrollView` correctly calculates its content size based on the `SyntaxHighlighter`.

## Verification Plan

### Automated Verification
- `analyze_file` on `aiService.ts` to check for syntax and type errors.
- Verify API request structure against OpenRouter documentation.

### Manual Verification
- **AI Chat**: Send a message to the AI and verify it responds based on the current algorithm.
- **Reasoning**: Check if the response feels "thoughtful" (as per the model's capabilities).
- **Code Editor**: Verify the width is fixed and horizontal scrolling works correctly without wrapping lines.
- **Scroll Limit**: Confirm you cannot scroll horizontally past the end of the longest code line.
