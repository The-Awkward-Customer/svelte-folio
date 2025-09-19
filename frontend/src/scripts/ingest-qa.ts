// scripts/ingest-qa.ts
import 'dotenv/config';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
// Import from your actual embeddings file
import { 
  generateEmbedding, 
  testHuggingFaceConnection,
  EMBEDDING_DIMENSION 
} from '../lib/server/embeddings.js';
import {
  insertQAPair,
  insertEmbedding,
  testSupabaseConnection,
  supabase,
} from '../lib/server/supabase-script.js';

/**
 * Optional: Clear existing data before re-ingesting
 */
async function clearExistingData() {
  console.log('🗑️  Clearing existing data...');
  
  try {
    // Delete embeddings first (due to foreign key constraint)
    const { error: embeddingsError } = await supabase
      .from('qa_embeddings')
      .delete()
      .gte('created_at', '1900-01-01');
    
    // Then delete Q&A pairs
    const { error: qaPairsError } = await supabase
      .from('qa_pairs')
      .delete()
      .gte('created_at', '1900-01-01');
    
    if (embeddingsError || qaPairsError) {
      console.error('Error clearing data:', { embeddingsError, qaPairsError });
      return false;
    }
    
    console.log('✅ Existing data cleared\n');
    return true;
  } catch (error) {
    console.error('Failed to clear data:', error);
    return false;
  }
}

/**
 * Verify all services are working
 */
async function verifyServices() {
  console.log('🔍 Verifying services...\n');
  
  // Test HuggingFace
  console.log('1️⃣  Testing HuggingFace connection...');
  const hfConnected = await testHuggingFaceConnection();
  if (!hfConnected) {
    console.error('❌ HuggingFace connection failed');
    return false;
  }
  console.log(`✅ HuggingFace connected (${EMBEDDING_DIMENSION}-dim embeddings)\n`);
  
  // Test Supabase
  console.log('2️⃣  Testing Supabase connection...');
  const sbConnected = await testSupabaseConnection();
  if (!sbConnected) {
    console.error('❌ Supabase connection failed');
    return false;
  }
  console.log('✅ Supabase connected\n');
  
  // Verify database schema
  console.log('3️⃣  Verifying database schema...');
  try {
    // Test RPC function with dummy embedding
    const dummyEmbedding = Array(EMBEDDING_DIMENSION).fill(0);
    const { error: rpcError } = await supabase.rpc('match_qa', {
      query_embedding: dummyEmbedding,
      similarity_threshold: 0.7,
      match_count: 1
    });
    
    if (rpcError?.code === '42883') {
      console.error('❌ RPC function match_qa not found. Please run the SQL setup.');
      return false;
    }
    
    console.log('✅ Database schema verified\n');
    return true;
  } catch (error) {
    console.error('Schema verification failed:', error);
    return false;
  }
}

/**
 * Batch process embeddings with rate limiting
 */
async function processQABatch(
  batch: Array<{ qa: any; category: string }>,
  startIndex: number
): Promise<{ success: number; failed: number; errors: Array<{ question: string; error: string }> }> {
  let success = 0;
  let failed = 0;
  const errors: Array<{ question: string; error: string }> = [];

  for (const [index, item] of batch.entries()) {
    const globalIndex = startIndex + index;
    const { qa, category } = item;

    try {
      process.stdout.write(`\r   Processing: ${globalIndex + 1} - "${qa.q.substring(0, 40)}..."`);

      // Generate embedding with retry logic
      let embedding: number[] | null = null;
      let retries = 3;
      
      while (retries > 0 && !embedding) {
        try {
          embedding = await generateEmbedding(qa.q);
          
          // Validate embedding
          if (embedding.length !== EMBEDDING_DIMENSION) {
            throw new Error(`Invalid embedding size: ${embedding.length} (expected ${EMBEDDING_DIMENSION})`);
          }
        } catch (err: any) {
          retries--;
          if (retries > 0) {
            console.log(`\n   ⚠️  Retry ${3 - retries}/3 for embedding generation...`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s before retry
          } else {
            throw err;
          }
        }
      }

      if (!embedding) {
        throw new Error('Failed to generate embedding after 3 attempts');
      }

      // Insert Q&A pair
      const qaPair = await insertQAPair(
        qa.q,
        qa.a,
        category,
        qa.tags || []
      );

      // Insert embedding
      await insertEmbedding(
        qaPair.id,
        qa.q,
        embedding,
        'question'
      );

      success++;

      // Rate limiting for HuggingFace API
      // HuggingFace free tier has limits, so we need to pace ourselves
      await new Promise(resolve => setTimeout(resolve, 500)); // 500ms between requests

    } catch (error: any) {
      console.error(`\n❌ Error: ${error.message}`);
      errors.push({
        question: qa.q?.substring(0, 50) + '...',
        error: error.message
      });
      failed++;
      
      // Extra delay on error to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return { success, failed, errors };
}

/**
 * Main ingestion function
 */
async function ingestQAContent() {
  console.log('🚀 Starting Q&A content ingestion with HuggingFace embeddings...\n');
  console.log(`📊 Using model: BAAI/bge-small-en-v1.5 (${EMBEDDING_DIMENSION} dimensions)\n`);

  try {
    // Verify all services are working
    if (!await verifyServices()) {
      console.error('\n❌ Service verification failed. Please check your setup.');
      process.exit(1);
    }

    // Check for --clear flag
    const shouldClear = process.argv.includes('--clear');
    if (shouldClear) {
      console.log('⚠️  --clear flag detected');
      await clearExistingData();
    }

    // Read all JSON files from modelData/dataSets directory
    const dataSetsPath = join(process.cwd(), 'src/modelData/dataSets');
    const files = readdirSync(dataSetsPath).filter(file => file.endsWith('.json'));

    console.log(`📂 Found ${files.length} JSON files: ${files.join(', ')}\n`);

    // Collect all Q&A pairs
    const allQAs: Array<{ qa: any; category: string }> = [];

    for (const file of files) {
      const filePath = join(dataSetsPath, file);
      const fileContent = JSON.parse(readFileSync(filePath, 'utf-8'));
      const fileName = file.replace('.json', '');

      console.log(`📄 Loading ${file}...`);

      Object.entries(fileContent).forEach(([category, questions]) => {
        if (Array.isArray(questions)) {
          const prefixedCategory = `${fileName}_${category}`;
          questions.forEach(qa => {
            if (qa.q && qa.a) {
              allQAs.push({ qa, category: prefixedCategory });
            }
          });
        }
      });
    }

    console.log(`\n📊 Total Q&A pairs to process: ${allQAs.length}\n`);

    // Process in batches to manage memory and API limits
    const BATCH_SIZE = 10;
    let totalSuccess = 0;
    let totalFailed = 0;
    const allErrors: Array<{ question: string; error: string }> = [];

    for (let i = 0; i < allQAs.length; i += BATCH_SIZE) {
      const batch = allQAs.slice(i, Math.min(i + BATCH_SIZE, allQAs.length));
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(allQAs.length / BATCH_SIZE);
      
      console.log(`\n📦 Processing batch ${batchNum}/${totalBatches} (${batch.length} items)`);
      
      const result = await processQABatch(batch, i);
      totalSuccess += result.success;
      totalFailed += result.failed;
      allErrors.push(...result.errors);
      
      console.log(`\n   Batch complete: ✅ ${result.success} | ❌ ${result.failed}`);
      
      // Longer pause between batches
      if (i + BATCH_SIZE < allQAs.length) {
        console.log('   Pausing before next batch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 INGESTION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successfully ingested: ${totalSuccess} Q&As`);
    console.log(`❌ Failed: ${totalFailed} Q&As`);
    console.log(`📈 Success rate: ${((totalSuccess / allQAs.length) * 100).toFixed(1)}%`);

    if (allErrors.length > 0) {
      console.log('\n❌ Error Details (first 5):');
      allErrors.slice(0, 5).forEach((e, i) => {
        console.log(`   ${i + 1}. ${e.question}`);
        console.log(`      Error: ${e.error}`);
      });
      if (allErrors.length > 5) {
        console.log(`   ... and ${allErrors.length - 5} more errors`);
      }
    }

    // Verify final counts in database
    const { count: qaCount } = await supabase
      .from('qa_pairs')
      .select('*', { count: 'exact', head: true });

    const { count: embedCount } = await supabase
      .from('qa_embeddings')
      .select('*', { count: 'exact', head: true });

    console.log('\n📈 Database Statistics:');
    console.log(`   Total Q&A pairs in DB: ${qaCount}`);
    console.log(`   Total embeddings in DB: ${embedCount}`);

    // Test search functionality
    await testSearchFunctionality();

  } catch (error) {
    console.error('\n💥 Fatal error during ingestion:', error);
    process.exit(1);
  }
}

/**
 * Test that search works after ingestion
 */
async function testSearchFunctionality() {
  console.log('\n🔍 Testing search functionality...');
  
  try {
    const testQueries = [
      "What technologies do you use?",
      "How can I contact you?",
      "What's your experience?"
    ];

    for (const query of testQueries) {
      console.log(`\n   Testing: "${query}"`);
      
      const embedding = await generateEmbedding(query);
      
      const { data, error } = await supabase.rpc('match_qa', {
        query_embedding: embedding,
        similarity_threshold: 0.5, // Lower threshold for testing
        match_count: 1
      });

      if (error) {
        console.error(`   ❌ Search failed: ${error.message}`);
        continue;
      }

      if (data && data.length > 0) {
        console.log(`   ✅ Found match: "${data[0].question?.substring(0, 50)}..."`);
        console.log(`      Similarity: ${(data[0].similarity * 100).toFixed(1)}%`);
      } else {
        console.log('   ⚠️  No matches found');
      }
    }
  } catch (error) {
    console.error('Search test error:', error);
  }
}

// Run the ingestion
console.log('='.repeat(60));
console.log('Q&A CONTENT INGESTION TOOL');
console.log('Powered by HuggingFace BGE-Small-En v1.5');
console.log('='.repeat(60));
console.log('Usage: npm run ingest-qa [--clear]');
console.log('  --clear: Clear existing data before ingesting\n');

ingestQAContent()
  .then(() => {
    console.log('\n✨ Ingestion complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Ingestion failed:', error);
    process.exit(1);
  });
