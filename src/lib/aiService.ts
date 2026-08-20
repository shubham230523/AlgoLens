import { VisualizationEvent } from '@/types/algorithm';

const OPENROUTER_API_KEY = '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';
const BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  reasoning_details?: any; // Preserved for reasoning continuity
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
    const indicesStr = Array.isArray(currentEvent.indices) ? currentEvent.indices.join(', ') : 'None';
    eventContext = `Currently, the algorithm is performing a ${currentEvent.type} operation.
Description: ${currentEvent.description}
Active Indices: [${indicesStr}]
Variables State: ${JSON.stringify(currentEvent.variables || {})}`;
  }

  return `You are the AlgoLens AI Tutor, an expert computer science instructor.
Your goal is to help users understand algorithms through interactive visualization.

Algorithm: ${algorithmName}
Implementation Code:
\`\`\`
${code}
\`\`\`

Current Visualization State:
${eventContext}

Guidelines:
1. Be concise and pedagogical.
2. Explain the "Why" behind the current step, not just the "What".
3. Use Markdown for formatting.
4. If the user asks something unrelated, bring them back to the algorithm.
`;
}

/**
 * Call OpenRouter API with reasoning enabled.
 */
export async function generateTutorResponse(
  messages: ChatMessage[],
  context: TutorContext
): Promise<ChatMessage> {
  const systemPrompt = constructSystemPrompt(context);

  // Prepare messages: system prompt + history
  const fullMessages = [
    { role: 'system', content: systemPrompt },
    ...messages
  ];

  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://algolens.app", // Optional
        "X-Title": "AlgoLens", // Optional
      },
      body: JSON.stringify({
        "model": "nvidia/nemotron-3.5-lightning:free",
        "messages": fullMessages,
        "reasoning": {"enabled": true}
      })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenRouter API Error:', errorData);
        throw new Error('Failed to fetch from AI service');
    }

    const result = await response.json();
    const assistantMessage = result.choices[0].message;

    return {
      role: 'assistant',
      content: assistantMessage.content,
      reasoning_details: assistantMessage.reasoning_details // Pass back for next call
    };
  } catch (error) {
    console.error('generateTutorResponse Error:', error);
    throw error;
  }
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
