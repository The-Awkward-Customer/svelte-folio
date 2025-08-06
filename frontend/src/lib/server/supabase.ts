// lib/server/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '$env/static/private';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Check rate limit for an identifier
 */
export async function checkRateLimit(
  identifier: string,
  limit: number = 20,
  windowSeconds: number = 60
): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_identifier: identifier,
      p_limit: limit,
      p_window_seconds: windowSeconds
    });

    if (error) {
      console.error('Rate limit check error:', error);
      // Fail open - allow request if rate limiting fails
      return { allowed: true, remaining: limit };
    }

    return {
      allowed: data[0]?.allowed || false,
      remaining: data[0]?.remaining || 0
    };
  } catch (error) {
    console.error('Rate limit error:', error);
    return { allowed: true, remaining: limit };
  }
}

/**
 * Log unanswered questions for analytics
 */
export async function logUnansweredQuestion(
  question: string,
  similarityScore: number | null = null,
  userIp: string | null = null
): Promise<void> {
  try {
    await supabase.from('unanswered_questions').insert({
      question,
      similarity_score: similarityScore,
      user_ip: userIp
    });
  } catch (error) {
    console.error('Failed to log unanswered question:', error);
    // Don't throw - this is analytics, not critical path
  }
}

/**
 * Search for similar Q&As using vector similarity
 */
export async function searchSimilarQAs(
  embedding: number[],
  threshold: number = 0.7,
  limit: number = 5
) {
  try {
    const { data, error } = await supabase.rpc('match_qa', {
      query_embedding: embedding,
      similarity_threshold: threshold,
      match_count: limit
    });

    if (error) {
      console.error('Supabase RPC error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

/**
 * Insert a new Q&A pair with embedding
 */
export async function insertQAPair(
  question: string,
  answer: string,
  category?: string,
  tags?: string[]
) {
  try {
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
 * Test Supabase connection
 */
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    // Simple health check - try to access the database
    const { data, error } = await supabase
      .from('qa_pairs')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Supabase test failed:', err);
    return false;
  }
}