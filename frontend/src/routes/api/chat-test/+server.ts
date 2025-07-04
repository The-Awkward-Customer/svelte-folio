// src/routes/api/chat-test/+server.ts
import { json } from '@sveltejs/kit';
import { generateEmbedding, generateChatResponse } from '$lib/server/openrouter.js';
import { searchSimilarQAs } from '$lib/server/supabase.js';
import type { RequestHandler } from './$types.js';

// Define the expected type for search results
interface QASearchResult {
  question: string;
  answer: string;
  similarity: number;
  category?: string;
  tags?: string[];
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { question } = await request.json();
    
    if (!question) {
      return json({ error: 'Question is required' }, { status: 400 });
    }

    console.log(`🤔 User question: "${question}"`);

    // Step 1: Generate embedding for the question
    console.log('🧠 Generating embedding...');
    const questionEmbedding = await generateEmbedding(question);
    
    // Step 2: Search for similar Q&As
    console.log('🔍 Searching for similar Q&As...');
    const searchResults = await searchSimilarQAs(questionEmbedding, 0.3, 3); // Lower threshold for testing
    
    // Type the results properly
    const similarQAs: QASearchResult[] = searchResults.map((result: any) => ({
      question: result.question || '',
      answer: result.answer || '',
      similarity: result.similarity || 0,
      category: result.category,
      tags: result.tags
    }));
    
    console.log(`📋 Found ${similarQAs.length} similar Q&As`);
    similarQAs.forEach((qa: QASearchResult, i: number) => {
      console.log(`   ${i + 1}. "${qa.question}" (similarity: ${qa.similarity?.toFixed(2)})`);
    });

    // Step 3: Generate response using context
    console.log('💭 Generating response...');
    const response = await generateChatResponse(question, similarQAs);
    
    console.log(`✅ Generated response: "${response.substring(0, 100)}..."`);

    return json({
      question,
      similarQAs: similarQAs.map((qa: QASearchResult) => ({
        question: qa.question,
        answer: qa.answer,
        similarity: qa.similarity
      })),
      response,
      debug: {
        embeddingLength: questionEmbedding.length,
        searchResults: similarQAs.length,
        responseLength: response.length
      }
    });

  } catch (error) {
    console.error('❌ Chat test error:', error);
    return json({ 
      error: 'Failed to process question',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};

// Also support GET for quick testing
export const GET: RequestHandler = async ({ url }) => {
  try {
    const question = url.searchParams.get('q') || 'Who are you?';
    
    console.log(`🤔 User question: "${question}"`);

    // Step 1: Generate embedding for the question
    console.log('🧠 Generating embedding...');
    const questionEmbedding = await generateEmbedding(question);
    
    // Step 2: Search for similar Q&As
    console.log('🔍 Searching for similar Q&As...');
    const searchResults = await searchSimilarQAs(questionEmbedding, 0.3, 3);
    
    // Type the results properly
    const similarQAs: QASearchResult[] = searchResults.map((result: any) => ({
      question: result.question || '',
      answer: result.answer || '',
      similarity: result.similarity || 0,
      category: result.category,
      tags: result.tags
    }));
    
    console.log(`📋 Found ${similarQAs.length} similar Q&As`);
    similarQAs.forEach((qa: QASearchResult, i: number) => {
      console.log(`   ${i + 1}. "${qa.question}" (similarity: ${qa.similarity?.toFixed(2)})`);
    });

    // Step 3: Generate response using context
    console.log('💭 Generating response...');
    const response = await generateChatResponse(question, similarQAs);
    
    console.log(`✅ Generated response: "${response.substring(0, 100)}..."`);

    return json({
      question,
      similarQAs: similarQAs.map((qa: QASearchResult) => ({
        question: qa.question,
        answer: qa.answer,
        similarity: qa.similarity
      })),
      response,
      debug: {
        embeddingLength: questionEmbedding.length,
        searchResults: similarQAs.length,
        responseLength: response.length
      }
    });

  } catch (error) {
    console.error('❌ Chat test error:', error);
    return json({
      error: 'Failed to process question',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};