// lib/server/openrouter.ts
import { OPEN_ROUTER_API_KEY } from '$env/static/private';

/**
 * Generate chat response using Claude Haiku
 * ALWAYS uses Q&A context
 */
export async function generateChatResponse(
  userQuestion: string,
  context: Array<{ question: string; answer: string; similarity: number }> = []
): Promise<string> {
  try {
    // Build context from similar Q&As
    const contextText = context
      .map(item => `Q: ${item.question}\nA: ${item.answer}`)
      .join('\n\n');

    const systemPrompt = `You are Pete, responding about your work in Product Design, Software Engineering, and Machine Learning.

CRITICAL: Base ALL responses on this Q&A context:
${contextText}

Rules:
- Use ONLY information from the Q&As above
- Speak in first person as Pete  
- Maximum 2-3 sentences
- If context lacks info, say "I haven't added that to my Q&A yet, but you can ask about [topic from context]"
– Avoid phrases such as "as I said", "as mentioned above", always try to answer directly
`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPEN_ROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://your-portfolio.com',
        'X-Title': 'Portfolio Q&A Chat'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userQuestion }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw new Error('Failed to generate response');
  }
}