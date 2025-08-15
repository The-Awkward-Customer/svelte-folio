# Phase 2: Message Logging Integration

**Goal**: Capture all chat messages with embeddings  
**Duration**: Week 2  
**Risk Level**: Medium  
**User Impact**: Potential slight response delay (async mitigated)

**Prerequisites**: Phase 1 complete and validated

## 2.1 Enhanced Chat Store Integration

Update your existing `chatStore.svelte.ts` to include logging:

```typescript
// Add import for session management
import { chatSession } from './chatSessionStore.svelte.ts';

class ChatStore {
  // ... existing properties ...

  async addMessage(message: ChatMessage): Promise<void> {
    // Ensure session exists before logging
    if (!chatSession.isActive && process.env.ENABLE_CHAT_LOGGING === 'true') {
      await chatSession.startSession();
    }

    // Add message to UI immediately
    this.messages.push(message);

    // Log message asynchronously (don't wait)
    this.logMessageAsync(message).catch(error => {
      console.error('Message logging failed:', error);
      // Silent failure - don't break chat functionality
    });
  }

  private async logMessageAsync(message: ChatMessage): Promise<void> {
    // Only log if enabled via environment variable
    if (process.env.ENABLE_CHAT_LOGGING !== 'true') {
      return;
    }

    if (!chatSession.sessionToken) return;

    try {
      await fetch('/api/chat/message/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken: chatSession.sessionToken,
          message: {
            id: message.id,
            type: message.type,
            content: message.content,
            timestamp: message.timestamp
          }
        })
      });
    } catch (error) {
      // Silent failure - no UI impact
      console.error('Message logging failed:', error);
    }
  }
}
```

## 2.2 Message Logging API

Create `/api/chat/message/log/+server.ts`:

```typescript
import { json } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase.js';
import { generateEmbedding } from '$lib/server/embeddings.js';
import type { RequestHandler } from './$types.js';

export const POST: RequestHandler = async ({ request }) => {
  // Check if logging is enabled
  if (process.env.ENABLE_CHAT_LOGGING !== 'true') {
    return json({ success: true, disabled: true });
  }

  try {
    const { sessionToken, message, metadata } = await request.json();

    // Get session
    const { data: session } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('session_token', sessionToken)
      .single();

    if (!session) {
      return json({ error: 'Session not found' }, { status: 400 });
    }

    // Generate embedding for user messages only
    let embedding = null;
    if (message.type === 'user') {
      try {
        embedding = await generateEmbedding(message.content);
      } catch (error) {
        console.error('Embedding generation failed:', error);
        // Continue without embedding - don't break logging
      }
    }

    // Get sequence order for this session
    const { count } = await supabase
      .from('chat_messages')
      .select('id', { count: 'exact' })
      .eq('session_id', session.id);

    // Insert message
    const { error } = await supabase
      .from('chat_messages')
      .insert({
        session_id: session.id,
        message_type: message.type,
        content: message.content,
        embedding,
        similar_qa_matches: metadata?.similarMatches,
        similarity_scores: metadata?.similarityScores,
        processing_time_ms: metadata?.processingTime,
        error_message: metadata?.error,
        sequence_order: (count || 0) + 1
      });

    if (error) throw error;

    // Update session message count
    await supabase
      .from('chat_sessions')
      .update({ 
        message_count: (count || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', session.id);

    return json({ success: true });
  } catch (error) {
    console.error('Message logging error:', error);
    return json({ error: 'Logging failed' }, { status: 500 });
  }
};
```

## 2.3 Enhanced Chat API Integration

Update your existing `/api/chat-test/+server.ts` to include session token and logging:

```typescript
export const POST: RequestHandler = async ({ request }) => {
  const startTime = Date.now();
  
  try {
    const { question, sessionToken } = await request.json();

    if (!question) {
      return json({ error: 'Question is required' }, { status: 400 });
    }

    console.log(`🤔 User question: "${question}"`);

    // Step 1: Generate embedding for the question
    console.log('🧠 Generating embedding...');
    const questionEmbedding = await generateEmbedding(question);

    // Step 2: Search for similar Q&As
    console.log('🔍 Searching for similar Q&As...');
    const searchResults = await searchSimilarQAs(questionEmbedding, 0.3, 3);

    const similarQAs = searchResults.map((result: any) => ({
      question: result.question || '',
      answer: result.answer || '',
      similarity: result.similarity || 0,
      category: result.category,
      tags: result.tags,
    }));

    // Step 3: Generate response using context
    console.log('💭 Generating response...');
    const response = await generateChatResponse(question, similarQAs);

    const processingTime = Date.now() - startTime;

    // Step 4: Log both user and assistant messages if session exists
    if (sessionToken && process.env.ENABLE_CHAT_LOGGING === 'true') {
      // Log user message
      fetch('/api/chat/message/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken,
          message: {
            id: crypto.randomUUID(),
            type: 'user',
            content: question,
            timestamp: new Date()
          }
        })
      }).catch(error => console.error('User message logging failed:', error));

      // Log assistant message with metadata
      fetch('/api/chat/message/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken,
          message: {
            id: crypto.randomUUID(),
            type: 'assistant',
            content: response,
            timestamp: new Date()
          },
          metadata: {
            similarMatches: similarQAs,
            similarityScores: similarQAs.map(qa => qa.similarity),
            processingTime
          }
        })
      }).catch(error => console.error('Assistant message logging failed:', error));
    }

    console.log(`✅ Generated response: "${response.substring(0, 100)}..."`);

    return json({
      question,
      similarQAs: similarQAs.map((qa) => ({
        question: qa.question,
        answer: qa.answer,
        similarity: qa.similarity,
      })),
      response,
      debug: {
        embeddingLength: questionEmbedding.length,
        searchResults: similarQAs.length,
        responseLength: response.length,
        processingTime
      },
    });
  } catch (error) {
    console.error('❌ Chat test error:', error);
    return json(
      {
        error: 'Failed to process question',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
};
```

## 2.4 Update QAChat Component

Modify your existing `QAChat.svelte` to pass session token:

```typescript
// In QAChat.svelte handleSendMessage function
async function handleSendMessage(question: string): Promise<void> {
  if (!question.trim() || chatStore.isLoading) {
    return;
  }

  const userMessage = createUserMessage(question);

  // Add user message immediately and set loading state
  chatStore.addMessage(userMessage);
  chatStore.setLoading(true);
  chatStore.setError(null);

  try {
    const response = await fetch('/api/chat-test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        question: question.trim(),
        sessionToken: chatSession.sessionToken // Add session token
      }),
    });

    const result: unknown = await response.json();

    if (!response.ok) {
      if (isChatApiError(result)) {
        throw new Error(`${result.error}: ${result.details || ''}`);
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    if (!isChatApiResponse(result)) {
      throw new Error('Invalid response format from server');
    }

    const assistantMessage = createAssistantMessage(result.response);

    chatStore.addMessage(assistantMessage);
    chatStore.setLoading(false);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to get response';
    console.error('Chat error:', err);

    chatStore.setError(errorMessage);
    chatStore.setLoading(false);
  }
}
```

Don't forget to import the session store:
```typescript
import { chatSession } from '$lib/stores/chatSessionStore.svelte.ts';
```

## 2.5 Success Criteria

- [ ] All user messages logged with embeddings
- [ ] All assistant messages logged with metadata
- [ ] No chat response delay >100ms
- [ ] Error logging captures failed message logs
- [ ] Session message counts updating correctly
- [ ] Environment toggle working (logging disabled when `ENABLE_CHAT_LOGGING=false`)
- [ ] Silent failures (logging errors don't break chat)

## 2.6 Testing Phase 2

### End-to-End Testing

```javascript
// Test complete conversation flow in browser console
async function testConversationLogging() {
  // 1. Start a session
  const sessionResponse = await fetch('/api/chat/session/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionToken: 'test_' + Date.now(),
      userAgent: navigator.userAgent,
      deviceType: 'desktop'
    })
  });
  console.log('Session:', await sessionResponse.json());

  // 2. Send a chat message
  const chatResponse = await fetch('/api/chat-test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: 'What technologies do you use?',
      sessionToken: 'test_' + Date.now()
    })
  });
  console.log('Chat:', await chatResponse.json());
}

testConversationLogging();
```

### Database Verification

```sql
-- Check messages are being logged
SELECT 
  s.session_token,
  s.message_count,
  m.message_type,
  m.content,
  m.sequence_order,
  m.created_at
FROM chat_sessions s
LEFT JOIN chat_messages m ON s.id = m.session_id
ORDER BY s.created_at DESC, m.sequence_order ASC
LIMIT 20;

-- Check embedding coverage
SELECT 
  message_type,
  COUNT(*) as total_messages,
  COUNT(embedding) as messages_with_embeddings,
  ROUND(COUNT(embedding)::numeric / COUNT(*) * 100, 2) as embedding_coverage_percent
FROM chat_messages 
GROUP BY message_type;

-- Check session message counts are accurate
SELECT 
  s.session_token,
  s.message_count as stored_count,
  COUNT(m.id) as actual_count,
  (s.message_count = COUNT(m.id)) as counts_match
FROM chat_sessions s
LEFT JOIN chat_messages m ON s.id = m.session_id
GROUP BY s.id, s.session_token, s.message_count
HAVING s.message_count != COUNT(m.id);
```

### Performance Testing

```bash
# Test response time with logging enabled
time curl -X POST https://your-app.vercel.app/api/chat-test \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What technologies do you use?",
    "sessionToken": "perf_test_123"
  }'

# Test response time with logging disabled (set ENABLE_CHAT_LOGGING=false)
time curl -X POST https://your-app.vercel.app/api/chat-test \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What technologies do you use?"
  }'
```

## 2.7 Troubleshooting

### Common Issues

**Messages not appearing in database:**
- Check `ENABLE_CHAT_LOGGING` environment variable
- Verify session exists before message logging
- Check browser network tab for failed API calls
- Verify Supabase permissions allow INSERT on chat_messages

**Embedding generation failing:**
- Check `HUGGING_FACE_INFERENCE_KEY` is valid
- Verify network access to HuggingFace API
- Check for rate limiting on HuggingFace
- Ensure embedding generation doesn't block message logging

**Performance issues:**
- Verify async logging is working (no blocking)
- Check database query performance
- Monitor Supabase usage dashboard
- Ensure embedding generation is async

### Debug Queries

```sql
-- Check for failed message logging
SELECT * FROM chat_messages WHERE error_message IS NOT NULL;

-- Check session without messages
SELECT s.session_token, s.message_count, COUNT(m.id) as actual_messages
FROM chat_sessions s
LEFT JOIN chat_messages m ON s.id = m.session_id
GROUP BY s.id, s.session_token, s.message_count
HAVING COUNT(m.id) = 0 AND s.created_at > NOW() - INTERVAL '1 hour';

-- Check processing times
SELECT 
  AVG(processing_time_ms) as avg_processing_time,
  MAX(processing_time_ms) as max_processing_time,
  COUNT(*) as total_messages
FROM chat_messages 
WHERE processing_time_ms IS NOT NULL
AND created_at > NOW() - INTERVAL '24 hours';
```

## Next Steps

Once Phase 2 is complete and validated:
1. **Verify** all success criteria are met
2. **Test** complete conversation flows in staging
3. **Monitor** performance impact for 48-72 hours
4. **Check** database growth and embedding coverage
5. **Proceed** to [Phase 3: Validation & Monitoring](./03-validation-monitoring.md)

**Important**: Monitor chat performance closely after Phase 2 deployment, as this introduces the most complexity to your existing system.