import {
  generateChatResponse,
} from './openrouter.js';
import { testSupabaseConnection } from './supabase.js';

export async function testPhase2Setup() {
  console.log('🧪 Testing Phase 2 Setup...\n');

  // Test 1: OpenRouter Connection (skipped - function not available)
  console.log('1. Testing OpenRouter connection... (skipped)');

  // Test 2: Supabase Connection
  console.log('\n2. Testing Supabase connection...');
  try {
    const isConnected = await testSupabaseConnection();
    console.log(isConnected ? '✅ Supabase connected' : '❌ Supabase failed');
  } catch (error) {
    console.log('❌ Supabase error:', error);
  }

  // Test 3: Generate Embedding (skipped - function not available)
  console.log('\n3. Testing embedding generation... (skipped)');

  // Test 4: Search (skipped - needs embedding function)
  console.log('\n4. Testing vector search... (skipped)');

  // Test 5: Chat Response
  console.log('\n5. Testing chat response...');
  try {
    const response = await generateChatResponse(
      'Hello, can you introduce yourself?'
    );
    console.log('✅ Chat response generated:');
    console.log(`"${response.substring(0, 100)}..."`);
  } catch (error) {
    console.log('❌ Chat response error:', error);
  }

  console.log('\n🎉 Phase 2 testing complete!');
}

// Uncomment to run the test
// testPhase2Setup();
