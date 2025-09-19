import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '$env/static/private';

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Search for similar Q&As using vector similarity
 * Uses 384-dimensional vectors from sentence-transformers
 */
export async function searchSimilarQAs(
  embedding: number[],
  threshold: number = 0.7,
  limit: number = 5
) {
  try {
    // Validate embedding dimensions
    if (embedding.length !== 384) {
      throw new Error(`Invalid embedding dimensions: expected 384, got ${embedding.length}`);
    }

    const { data, error } = await supabase.rpc('match_qa', {
      query_embedding: embedding,
      similarity_threshold: threshold,
      match_count: limit
    });

    if (error) {
      console.error('Supabase RPC error:', error);
      
      // Handle missing function gracefully
      if (error.message?.includes('function match_qa') || error.code === '42883') {
        console.warn('match_qa function not found, returning empty results');
        return [];
      }
      
      throw new Error(`Supabase RPC error: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Search error details:', error);
    throw error;
  }
}

/**
 * Insert a new Q&A pair with embedding
 */
export async function insertQAPair(
  question: string,
  answer: string,
  category?: string,
  tags?: string[],
  embedding?: number[]
) {
  try {
    // Start a transaction-like operation
    // First, insert the Q&A pair
    const { data: qaData, error: qaError } = await supabase
      .from('qa_pairs')
      .insert({
        question,
        answer,
        category,
        tags
      })
      .select()
      .single();

    if (qaError) throw qaError;

    // If embedding is provided, insert it
    if (embedding && qaData) {
      await insertEmbedding(qaData.id, question, embedding, 'question');
    }

    return qaData;
  } catch (error) {
    console.error('Error inserting Q&A pair:', error);
    throw new Error('Failed to insert Q&A pair');
  }
}

/**
 * Insert embedding for a Q&A pair
 */
export async function insertEmbedding(
  qaId: string,
  content: string,
  embedding: number[],
  contentType: 'question' | 'answer' = 'question'
) {
  try {
    // Validate embedding dimensions
    if (embedding.length !== 384) {
      throw new Error(`Invalid embedding dimensions: expected 384, got ${embedding.length}`);
    }

    const { data, error } = await supabase
      .from('qa_embeddings')
      .insert({
        qa_id: qaId,
        content,
        embedding,
        content_type: contentType
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error inserting embedding:', error);
    throw new Error('Failed to insert embedding');
  }
}

/**
 * Check rate limit for an identifier (usually IP address)
 */
export async function checkRateLimit(
  identifier: string,
  limit: number = 30,
  windowSeconds: number = 60
): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_identifier: identifier,
      p_limit: limit,
      p_window_seconds: windowSeconds
    });

    if (error) throw error;

    // Return the first result or default values
    return data?.[0] || { allowed: false, remaining: 0 };
  } catch (error) {
    console.error('Rate limit check error:', error);
    // On error, be conservative and deny access
    return { allowed: false, remaining: 0 };
  }
}

/**
 * Log an unanswered question for analytics
 */
export async function logUnansweredQuestion(
  question: string,
  similarityScore?: number,
  userIp?: string
) {
  try {
    const { error } = await supabase
      .from('unanswered_questions')
      .insert({
        question,
        similarity_score: similarityScore,
        user_ip: userIp
      });

    if (error) {
      console.error('Error logging unanswered question:', error);
    }
  } catch (error) {
    // Don't throw - this is for analytics only
    console.error('Failed to log unanswered question:', error);
  }
}

/**
 * Test Supabase connection
 */
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    // Test connection by checking if tables exist
    const { error: qaPairsError } = await supabase
      .from('qa_pairs')
      .select('id')
      .limit(1);
    
    const { error: embeddingsError } = await supabase
      .from('qa_embeddings')
      .select('id')
      .limit(1);
    
    if (qaPairsError || embeddingsError) {
      console.error('Supabase connection errors:', { qaPairsError, embeddingsError });
      return false;
    }
    
    console.log('✅ Supabase connected successfully');
    return true;
  } catch (err) {
    console.error('Supabase test failed:', err);
    return false;
  }
}

/**
 * Get all Q&A pairs (for debugging/admin)
 */
export async function getAllQAPairs() {
  try {
    const { data, error } = await supabase
      .from('qa_pairs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching Q&A pairs:', error);
    throw new Error('Failed to fetch Q&A pairs');
  }
}

/**
 * Delete old rate limit records (cleanup)
 */
export async function cleanupOldRateLimits() {
  try {
    const { error } = await supabase.rpc('cleanup_old_rate_limits');
    
    if (error) {
      console.error('Cleanup error:', error);
    }
  } catch (error) {
    console.error('Failed to cleanup rate limits:', error);
  }
}
