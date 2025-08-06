// scripts/ingest-qa.ts
import 'dotenv/config';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { generateEmbedding } from '../lib/server/embeddings-script.js';
import { 
  insertQAPair, 
  insertEmbedding,
  supabase
} from '../lib/server/supabase-script.js';

async function ingestQAContent() {
  console.log('🚀 Starting Q&A content ingestion...\n');
  
  try {
    // Read all JSON files from modelData/dataSets directory
    const dataSetsPath = join(process.cwd(), 'src/modelData/dataSets');
    const files = readdirSync(dataSetsPath).filter(file => file.endsWith('.json'));
    
    console.log(`📂 Found ${files.length} JSON files to process: ${files.join(', ')}\n`);
    
    let allContent: Record<string, any[]> = {};
    
    // Read and combine all JSON files
    for (const file of files) {
      const filePath = join(dataSetsPath, file);
      const fileContent = JSON.parse(readFileSync(filePath, 'utf-8'));
      const fileName = file.replace('.json', '');
      
      console.log(`📄 Processing file: ${file}`);
      
      // Merge content with filename as prefix for categories
      Object.entries(fileContent).forEach(([category, questions]) => {
        const prefixedCategory = `${fileName}_${category}`;
        allContent[prefixedCategory] = questions as any[];
      });
    }
    
    const content = allContent;
    
    let totalIngested = 0;
    let totalErrors = 0;
    
    // Process each category
    for (const [category, questions] of Object.entries(content)) {
      console.log(`\n📁 Processing category: ${category}`);
      
      if (!Array.isArray(questions)) {
        console.log(`⚠️  Skipping ${category} - not an array`);
        continue;
      }
      
      for (const qa of questions as any[]) {
        try {
          console.log(`\n❓ Question: "${qa.q.substring(0, 50)}..."`);
          
          // Insert Q&A pair
          const qaPair = await insertQAPair(
            qa.q,
            qa.a,
            category,
            qa.tags
          );
          
          console.log(`✅ Inserted Q&A pair: ${qaPair.id}`);
          
          // Generate and insert embedding for question
          console.log('🔄 Generating embedding...');
          const embedding = await generateEmbedding(qa.q);
          
          await insertEmbedding(
            qaPair.id,
            qa.q,
            embedding,
            'question'
          );
          
          console.log('✅ Embedding stored');
          totalIngested++;
          
          // Rate limit to avoid hitting API limits
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.error(`❌ Error processing Q&A: ${error}`);
          totalErrors++;
        }
      }
    }
    
    console.log('\n📊 Ingestion Summary:');
    console.log(`✅ Successfully ingested: ${totalIngested} Q&As`);
    console.log(`❌ Errors: ${totalErrors}`);
    
    // Verify ingestion
    const { count } = await supabase
      .from('qa_pairs')
      .select('*', { count: 'exact', head: true });
    
    console.log(`\n📈 Total Q&As in database: ${count}`);
    
  } catch (error) {
    console.error('Fatal error during ingestion:', error);
    process.exit(1);
  }
}

// Run the ingestion
ingestQAContent();