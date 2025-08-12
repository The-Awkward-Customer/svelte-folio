// src/routes/api/test-setup/+server.ts
import { json } from '@sveltejs/kit';
import { generateChatResponse } from '$lib/server/openrouter.js';
import {
  generateEmbedding,
  testHuggingFaceConnection,
} from '$lib/server/embeddings.js';
import {
  testSupabaseConnection,
  searchSimilarQAs,
} from '$lib/server/supabase.js';
import type { RequestHandler } from './$types.js';

export const GET: RequestHandler = async () => {
  const results: Array<{ test: string; status: string; details?: string }> = [];

  // Test 1: HuggingFace Connection
  try {
    const isConnected = await testHuggingFaceConnection();
    results.push({
      test: 'HuggingFace Connection',
      status: isConnected ? 'PASS' : 'FAIL',
    });
  } catch (error) {
    results.push({
      test: 'HuggingFace Connection',
      status: 'ERROR',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Test 2: Supabase Connection
  try {
    const isConnected = await testSupabaseConnection();
    results.push({
      test: 'Supabase Connection',
      status: isConnected ? 'PASS' : 'FAIL',
    });
  } catch (error) {
    results.push({
      test: 'Supabase Connection',
      status: 'ERROR',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Test 3: Generate Embedding
  try {
    const embedding = await generateEmbedding('What technologies do you use?');
    results.push({
      test: 'Embedding Generation',
      status: 'PASS',
      details: `Generated ${embedding.length} dimensions`,
    });
  } catch (error) {
    results.push({
      test: 'Embedding Generation',
      status: 'ERROR',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Test 4: Vector Search (will be empty but should not error)
  try {
    const testEmbedding = await generateEmbedding('test query');
    const searchResults = await searchSimilarQAs(testEmbedding, 0.5, 3);
    results.push({
      test: 'Vector Search',
      status: 'PASS',
      details: `Found ${searchResults.length} results`,
    });
  } catch (error) {
    results.push({
      test: 'Vector Search',
      status: 'ERROR',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Test 5: Chat Response
  try {
    const response = await generateChatResponse(
      'Hello, can you introduce yourself?'
    );
    results.push({
      test: 'Chat Response',
      status: 'PASS',
      details: `Generated response: "${response.substring(0, 50)}..."`,
    });
  } catch (error) {
    results.push({
      test: 'Chat Response',
      status: 'ERROR',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Summary
  const passed = results.filter((r) => r.status === 'PASS').length;
  const total = results.length;
  const allPassed = passed === total;

  return json({
    summary: {
      passed,
      total,
      allPassed,
      message: allPassed
        ? '🎉 All tests passed! Phase 2 setup complete.'
        : `⚠️ ${passed}/${total} tests passed. Check failed tests below.`,
    },
    results,
  });
};
