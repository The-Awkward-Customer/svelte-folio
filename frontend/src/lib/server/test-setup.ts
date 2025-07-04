import { generateEmbedding, generateChatResponse, testOpenRouterConnection } from './openrouter.js';
import { testSupabaseConnection, searchSimilarQAs } from './supabase.js';

export async function testPhase2Setup() {
  console.log('🧪 Testing Phase 2 Setup...\n');

  // Test 1: OpenRouter Connection
  console.log('1. Testing OpenRouter connection...');
  try {
    const isConnected = await testOpenRouterConnection();
    console.log(isConnected ? '✅ OpenRouter connected' : '❌ OpenRouter failed');
  } catch (error) {
    console.log('❌ OpenRouter error:', error);
  }

  // Test 2: Supabase Connection
  console.log('\n2. Testing Supabase connection...');
  try {
    const isConnected = await testSupabaseConnection();
    console.log(isConnected ? '✅ Supabase connected' : '❌ Supabase failed');
  } catch (error) {
    console.log('❌ Supabase error:', error);
  }

  // Test 3: Generate Embedding
  console.log('\n3. Testing embedding generation...');
  try {
    const embedding = await generateEmbedding('What technologies do you use?');
    console.log(`✅ Generated embedding with ${embedding.length} dimensions`);
  } catch (error) {
    console.log('❌ Embedding error:', error);
  }

  // Test 4: Search (will be empty but should not error)
  console.log('\n4. Testing vector search...');
  try {
    const testEmbedding = await generateEmbedding('test query');
    const results = await searchSimilarQAs(testEmbedding, 0.5, 3);
    console.log(`✅ Search completed, found ${results.length} results`);
  } catch (error) {
    console.log('❌ Search error:', error);
  }

  // Test 5: Chat Response
  console.log('\n5. Testing chat response...');
  try {
    const response = await generateChatResponse('Hello, can you introduce yourself?');
    console.log('✅ Chat response generated:');
    console.log(`"${response.substring(0, 100)}..."`);
  } catch (error) {
    console.log('❌ Chat response error:', error);
  }

  console.log('\n🎉 Phase 2 testing complete!');
}

// Uncomment to run the test
// testPhase2Setup();