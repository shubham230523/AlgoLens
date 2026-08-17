import { VisualizationEvent } from '@/types/algorithm';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface TutorContext {
  algorithmName: string;
  code: string;
  currentEvent: VisualizationEvent | null;
}

/**
 * Generates a prompt for the AI Tutor based on the current algorithm state.
 */
function constructSystemPrompt(context: TutorContext): string {
  const { algorithmName, code, currentEvent } = context;

  let eventContext = 'The algorithm has just started.';
  if (currentEvent) {
    eventContext = `Currently, the algorithm is performing a ${currentEvent.type} operation.
Description: ${currentEvent.description}
Active Indices: ${currentEvent.indices.join(', ')}
Variables State: ${JSON.stringify(currentEvent.variables || {})}`;
  }

  return `You are the AlgoLens AI Tutor, an expert computer science instructor.
Your goal is to help users understand algorithms through interactive visualization.

Algorithm: ${algorithmName}
Implementation Code:
\`\`\`javascript
${code}
\`\`\`

Current Visualization State:
${eventContext}

Guidelines:
1. Be concise and pedagogical.
2. Explain the "Why" behind the current step, not just the "What".
3. Use simple analogies when helpful.
4. If the user asks about something unrelated to the algorithm, politely bring them back to the topic.
5. You can use markdown for formatting (bold, italics, small code snippets).
`;
}

/**
 * Mock LLM call that simulates a thoughtful response.
 * In production, this would call OpenAI, Gemini, or a backend proxy.
 */
export async function generateTutorResponse(
  messages: ChatMessage[],
  context: TutorContext
): Promise<string> {
  // Simulate network check
  // In a real app, use NetInfo to check connectivity
  const isOffline = false; // Mock offline check

  if (isOffline) {
    return "It looks like you're offline. I can provide basic algorithm info, but deep AI explanations require a connection. How else can I help with the visual steps?";
  }

  const systemPrompt = constructSystemPrompt(context);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const lastUserMessage = messages[messages.length - 1].content.toLowerCase();
  const { currentEvent, algorithmName } = context;

  // Intelligent mock responses based on common questions
  if (lastUserMessage.includes('why') || lastUserMessage.includes('explain')) {
    if (currentEvent?.type === 'COMPARE') {
      return `We are comparing these values to decide if they are in the correct order. In **${algorithmName}**, this comparison is the core logic that determines if a swap or a move is necessary to satisfy the algorithm's goal.`;
    }
    if (currentEvent?.type === 'SWAP') {
      return `A swap occurs here because the elements were out of order. By swapping them, we are moving the larger (or smaller) element closer to its final sorted position.`;
    }
    return `This step is part of the **${algorithmName}** logic. ${currentEvent?.description}. It ensures that we are making progress towards the final result while maintaining the algorithm's invariants.`;
  }

  if (lastUserMessage.includes('complexity') || lastUserMessage.includes('big o')) {
    return `The time complexity of this algorithm is often a key point. For **${algorithmName}**, you'll notice how the number of operations grows as the input size increases. Would you like to discuss the specific Big O notation for this case?`;
  }

  return `That's a great question! Looking at the current state where we just ${currentEvent?.description || 'started'}, what part of the logic seems most confusing to you? I can explain the code or the visual steps.`;
}

export function getSuggestedQuestions(context: TutorContext): string[] {
  const { currentEvent } = context;
  const questions = ['Explain this step', 'What is the complexity?'];

  if (currentEvent?.type === 'SWAP') {
    questions.unshift('Why swap these?');
  } else if (currentEvent?.type === 'COMPARE') {
    questions.unshift('What are we comparing?');
  } else if (currentEvent?.type === 'MARK_SORTED') {
    questions.unshift('Is it fully sorted now?');
  }

  return questions.slice(0, 3);
}
