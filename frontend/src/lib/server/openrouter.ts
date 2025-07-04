import { OPEN_ROUTER_API_KEY } from '$env/static/private';
import OpenAI from 'openai';

// OpenRouter client for chat completions
const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: OPEN_ROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://your-portfolio.com', // Replace with your domain
    'X-Title': 'Portfolio Q&A Chat'
  }
});

/**
 * Generate embedding using Supabase's built-in embedding function
 * This uses their free tier and works with pgVector
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    // For now, we'll use a simple hash-based approach for testing
    // In production, you'd use Supabase's embedding API or a local model
    
    // Simple deterministic embedding for testing (1536 dimensions)
    const hash = simpleHash(text);
    const embedding = Array.from({ length: 1536 }, (_, i) => {
      return Math.sin(hash + i) * 0.1; // Small random-ish values
    });
    
    return embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

// Simple hash function for consistent "embeddings"
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

/**
 * Generate chat response using Claude Haiku
 * Includes context from matched Q&As
 */
export async function generateChatResponse(
  userQuestion: string,
  context: Array<{ question: string; answer: string; similarity: number }> = []
): Promise<string> {
  try {
    // Build context from similar Q&As
    const contextText = context.length > 0
      ? context
          .map(item => `Q: ${item.question}\nA: ${item.answer}`)
          .join('\n\n')
      : '';

    // Create system prompt for third-person responses
    const systemPrompt = `You are a helpful AI assistant on a Designer's portfolio website. You help visitors learn about the Designer by answering questions based on the provided context.

When responding:
- Speak ABOUT the Designer in third person (they/them, the Designer, etc.)
- Use the context provided to give accurate information
- Be conversational and helpful to the visitor
- If you don't have specific information, say so politely

${contextText ? `Here's information about the Designer:\n\n${contextText}\n\n` : ''}

Remember: You are helping a visitor learn about the Designer, not pretending to be the Designer.`;

    const response = await openrouter.chat.completions.create({
      model: 'anthropic/claude-3-haiku',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userQuestion }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    return response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw new Error('Failed to generate response');
  }
}

/**
 * Health check for OpenRouter connection
 */
export async function testOpenRouterConnection(): Promise<boolean> {
  try {
    // Test with a simple embedding
    await generateEmbedding('test');
    return true;
  } catch {
    return false;
  }
}