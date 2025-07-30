
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateEmbedding } from '$lib/server/embeddings';
import { generateChatResponse } from '$lib/server/openrouter';
import { 
  searchSimilarQAs, 
  checkRateLimit, 
  logUnansweredQuestion 
} from '$lib/server/supabase';

const SIMILARITY_THRESHOLD = 0.7;
const RATE_LIMIT = 30; // 30 requests per minute
const RATE_LIMIT_WINDOW = 60; // 60 seconds

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
  try {
    // Get client IP for rate limiting
    const clientIp = getClientAddress();
    
    // Check rate limit
    const { allowed, remaining } = await checkRateLimit(
      clientIp, 
      RATE_LIMIT, 
      RATE_LIMIT_WINDOW
    );
    
    if (!allowed) {
      return json(
        { 
          error: 'Too many requests. Please wait a moment before asking another question.',
          retryAfter: RATE_LIMIT_WINDOW 
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + RATE_LIMIT_WINDOW * 1000).toISOString()
          }
        }
      );
    }

    // Parse request
    const { question } = await request.json();
    
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return json({ error: 'Please provide a question' }, { status: 400 });
    }

    // Sanitize question
    const sanitizedQuestion = question.trim().slice(0, 500); // Max 500 chars

    // Generate embedding for the question
    const embedding = await generateEmbedding(sanitizedQuestion);
    
    // Search for similar Q&As
    const similarQAs = await searchSimilarQAs(
      embedding, 
      SIMILARITY_THRESHOLD, 
      3
    );
    
    // Log analytics if no good matches found
    const topSimilarity = similarQAs[0]?.similarity || 0;
    if (similarQAs.length === 0 || topSimilarity < SIMILARITY_THRESHOLD) {
      await logUnansweredQuestion(
        sanitizedQuestion,
        topSimilarity,
        clientIp
      );
    }
    
    // Always use Claude to generate response with Q&A context
    const response = await generateChatResponse(sanitizedQuestion, similarQAs);
    
    // Get suggested questions from similar Q&As
    const suggestedQuestions = similarQAs
      .slice(0, 3)
      .map(qa => qa.question)
      .filter(q => q && q.length > 0);
    
    return json(
      { 
        response,
        similarity: topSimilarity,
        suggestedQuestions
      },
      {
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': new Date(Date.now() + RATE_LIMIT_WINDOW * 1000).toISOString()
        }
      }
    );
    
  } catch (error) {
    console.error('Chat API error:', error);
    return json(
      { error: 'Failed to process your question. Please try again.' },
      { status: 500 }
    );
  }
};