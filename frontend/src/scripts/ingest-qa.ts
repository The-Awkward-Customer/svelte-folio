// scripts/ingest-qa.ts
import { readFile } from 'fs/promises';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

interface QAItem {
  q: string;
  a: string;
  tags: string[];
}

interface QAContent {
  [category: string]: QAItem[];
}

// Create Supabase client directly with environment variables
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Simple embedding generation (using the same approach as your server)
function generateEmbedding(text: string): Promise<number[]> {
  return Promise.resolve((() => {
    // Simple deterministic embedding for testing (1536 dimensions)
    const hash = simpleHash(text);
    const embedding = Array.from({ length: 1536 }, (_, i) => {
      return Math.sin(hash + i) * 0.1; // Small random-ish values
    });
    
    return embedding;
  })());
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

// Insert Q&A pair function
async function insertQAPair(question: string, answer: string, category: string, tags: string[]) {
  const { data, error } = await supabase
    .from('qa_pairs')
    .insert({
      question,
      answer,
      category,
      tags
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Insert embedding function
async function insertEmbedding(qaId: string, content: string, embedding: number[], contentType: 'question' | 'answer') {
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
}

async function main() {
  console.log('🚀 Starting Q&A ingestion...\n');

  // Check environment variables
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('❌ Missing environment variables!');
    console.error('Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set in .env.local');
    process.exit(1);
  }

  try {
    // Read the Q&A content file
    const contentPath = join(process.cwd(), 'src', 'data', 'qa-content.json');
    console.log(`📖 Reading content from: ${contentPath}`);
    
    const fileContent = await readFile(contentPath, 'utf-8');
    const qaContent: QAContent = JSON.parse(fileContent);

    let totalProcessed = 0;
    let totalErrors = 0;

    // Process each category
    for (const [category, items] of Object.entries(qaContent)) {
      console.log(`📂 Processing category: ${category}`);
      console.log(`   Items: ${items.length}`);

      for (const [index, item] of items.entries()) {
        try {
          console.log(`   🔄 Processing item ${index + 1}/${items.length}: "${item.q.substring(0, 50)}..."`);

          // Insert Q&A pair
          const qaRecord = await insertQAPair(
            item.q,
            item.a,
            category,
            item.tags
          );

          console.log(`   ✅ Inserted Q&A: ${qaRecord.id}`);

          // Generate and insert embeddings for both question and answer
          console.log(`   🧠 Generating embeddings...`);
          
          // Question embedding
          const questionEmbedding = await generateEmbedding(item.q);
          await insertEmbedding(qaRecord.id, item.q, questionEmbedding, 'question');
          
          // Answer embedding (helps with more comprehensive search)
          const answerEmbedding = await generateEmbedding(item.a);
          await insertEmbedding(qaRecord.id, item.a, answerEmbedding, 'answer');

          console.log(`   ✅ Generated embeddings for question and answer`);
          
          totalProcessed++;
          
          // Small delay to be gentle on the database
          await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error) {
          console.error(`   ❌ Error processing item: ${error}`);
          totalErrors++;
        }
      }

      console.log(`✅ Completed category: ${category}\n`);
    }

    // Summary
    console.log('📊 Ingestion Summary:');
    console.log(`   ✅ Successfully processed: ${totalProcessed} Q&A pairs`);
    console.log(`   ❌ Errors: ${totalErrors}`);

    if (totalErrors === 0) {
      console.log('\n🎉 All Q&A content has been successfully ingested!');
      console.log('🔍 You can now test the chat functionality.');
    } else {
      console.log(`\n⚠️  Completed with ${totalErrors} errors. Check the logs above.`);
    }

  } catch (error) {
    console.error('💥 Fatal error during ingestion:', error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);