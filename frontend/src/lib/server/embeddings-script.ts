// lib/server/embeddings-script.ts
import { OPEN_ROUTER_API_KEY } from '$env/static/private';

/**
 * Generate 384-dimensional embedding using OpenRouter
 * Uses text-embedding-3-small model for optimal performance
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPEN_ROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://your-portfolio.com', // Replace with your domain
        'X-Title': 'Portfolio Q&A Embeddings'
      },
      body: JSON.stringify({
        model: 'openai/text-embedding-3-small', // 384-dimensional model
        input: text,
        dimensions: 384 // Explicitly request 384 dimensions
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Embedding API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    
    // Extract embedding from response
    const embedding = data.data?.[0]?.embedding;
    
    if (!embedding) {
      throw new Error('No embedding returned from API');
    }
    
    if (embedding.length !== 384) {
      throw new Error(`Invalid embedding dimensions: expected 384, got ${embedding.length}`);
    }

    return embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Alternative: Generate embedding using Supabase's Edge Function
 * This is free and doesn't require OpenRouter
 */
export async function generateEmbeddingSupabase(
  text: string,
  supabaseUrl: string,
  supabaseKey: string
): Promise<number[]> {
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/embeddings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: text,
        model: 'gte-small' // 384-dimensional model
      })
    });

    if (!response.ok) {
      throw new Error(`Supabase embedding error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.embedding;
  } catch (error) {
    console.error('Error with Supabase embedding:', error);
    throw error;
  }
}