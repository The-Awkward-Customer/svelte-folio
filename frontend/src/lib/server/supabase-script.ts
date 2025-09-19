// lib/server/supabase-script.ts
import { createClient } from '@supabase/supabase-js';

// Get environment variables from process.env for script context
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Insert a Q&A pair into the database
 */
export async function insertQAPair(
  question: string,
  answer: string,
  category?: string,
  tags?: string[]
) {
  try {
    const { data, error } = await supabase
      .from('qa_pairs')
      .insert({
        question,
        answer,
        category,
        tags: tags || []
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to insert Q&A pair: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error inserting Q&A pair:', error);
    throw error;
  }
}

/**
 * Insert embedding for a Q&A pair
 * IMPORTANT: Must be 384 dimensions
 */
export async function insertEmbedding(
  qaId: string,
  content: string,
  embedding: number[],
  contentType: 'question' | 'answer' = 'question'
) {
  try {
    // Critical: Validate dimensions
    if (embedding.length !== 384) {
      throw new Error(
        `Invalid embedding dimensions: expected 384, got ${embedding.length}. ` +
        `Please ensure you're using text-embedding-3-small or a 384-dim model.`
      );
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

    if (error) {
      // Check for specific vector dimension error
      if (error.message?.includes('dimension')) {
        throw new Error(
          `Vector dimension mismatch. Database expects 384 dimensions, got ${embedding.length}. ` +
          `Error: ${error.message}`
        );
      }
      throw new Error(`Failed to insert embedding: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error inserting embedding:', error);
    throw error;
  }
}

/**
 * Test Supabase connection and schema
 */
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    // Test connection
    const { error: pingError } = await supabase
      .from('qa_pairs')
      .select('count')
      .limit(1);

    if (pingError) {
      console.error('Cannot connect to Supabase:', pingError);
      return false;
    }

    console.log('✅ Connected to Supabase');
    return true;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return false;
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
  if (embedding.length !== 384) {
    throw new Error(`Invalid search embedding: expected 384 dimensions, got ${embedding.length}`);
  }

  try {
    const { data, error } = await supabase.rpc('match_qa', {
      query_embedding: embedding,
      similarity_threshold: threshold,
      match_count: limit
    });

    if (error) {
      console.error('Search error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
}
