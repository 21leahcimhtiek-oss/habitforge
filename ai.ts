import { APP_CONFIG, OPENROUTER_API_URL, OPENROUTER_MODEL } from './config';

export type AIRole = 'system' | 'user' | 'assistant';

export type AIMessage = {
  role: AIRole;
  content: string;
};

export const generateAIReply = async (
  userPrompt: string,
  systemPrompt: string,
  history: AIMessage[] = []
): Promise<string> => {
  const apiKey = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || '';
  if (!apiKey) {
    throw new Error('Missing EXPO_PUBLIC_OPENROUTER_API_KEY');
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': APP_CONFIG.website,
      'X-Title': APP_CONFIG.appName,
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') {
    throw new Error('No AI response content received');
  }

  return content.trim();
};
