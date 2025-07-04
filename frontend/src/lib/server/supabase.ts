import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '$env/static/private';

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Search for similar Q&As using vector similarity
 */
export async function searchSimilarQAs(
  embedding: number[],
  threshold: number = 0.8,
  limit: number = 5
) {
  try {
    // Convert the number array to a PostgreSQL vector format
    const { data, error } = await supabase.rpc('match_qa', {
      query_embedding: embedding, // Pass as array - Supabase handles the conversion
      match_threshold: threshold,
      match_count: limit
    });

    if (error) {
      console.error('Supabase RPC error:', error);
      
      // If the function doesn't exist, return empty array
      if (error.message?.includes('function match_qa') || error.code === '42883') {
        console.warn('match_qa function not found, returning empty results');
        return [];
      }
      
      throw new Error(`Supabase RPC error: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Search error details:', error);
    throw new Error('Failed to search Q&As');
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
    // Insert Q&A pair
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