# Phase 3: Data Validation & Monitoring

**Goal**: Ensure logging is working correctly  
**Duration**: Week 3  
**Risk Level**: Low  
**User Impact**: None

**Prerequisites**: Phase 2 complete with stable message logging

## 3.1 Logging Validation API

Create `/api/admin/chat/validate/+server.ts`:

```typescript
import { json } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase.js';
import type { RequestHandler } from './$types.js';

export const GET: RequestHandler = async ({ request }) => {
  try {
    // Basic health check - verify data is being captured
    const { count: sessionCount } = await supabase
      .from('chat_sessions')
      .select('id', { count: 'exact' });

    const { count: messageCount } = await supabase
      .from('chat_messages')
      .select('id', { count: 'exact' });

    // Check recent activity (last 24 hours)
    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);
    
    const { count: recentSessions } = await supabase
      .from('chat_sessions')
      .select('id', { count: 'exact' })
      .gte('started_at', yesterday.toISOString());

    const { count: recentMessages } = await supabase
      .from('chat_messages')
      .select('id', { count: 'exact' })
      .gte('created_at', yesterday.toISOString());

    // Check for basic data integrity issues
    const { data: sessionsWithoutMessages } = await supabase
      .from('chat_sessions')
      .select('id, session_token')
      .eq('message_count', 0)
      .gte('started_at', yesterday.toISOString());

    // Check embedding coverage for user messages
    const { data: embeddingStats } = await supabase
      .from('chat_messages')
      .select('id, embedding')
      .eq('message_type', 'user')
      .gte('created_at', yesterday.toISOString());

    const userMessagesWithEmbeddings = embeddingStats?.filter(m => m.embedding) || [];
    const embeddingCoverage = embeddingStats?.length > 0 
      ? Math.round((userMessagesWithEmbeddings.length / embeddingStats.length) * 100)
      : 100;

    // Check for error messages
    const { count: errorCount } = await supabase
      .from('chat_messages')
      .select('id', { count: 'exact' })
      .not('error_message', 'is', null)
      .gte('created_at', yesterday.toISOString());

    return json({
      status: 'ok',
      timestamp: new Date(),
      enabled: process.env.ENABLE_CHAT_LOGGING === 'true',
      counts: {
        totalSessions: sessionCount || 0,
        totalMessages: messageCount || 0,
        recentSessions: recentSessions || 0,
        recentMessages: recentMessages || 0,
        sessionsWithoutMessages: sessionsWithoutMessages?.length || 0,
        errorsInLast24h: errorCount || 0
      },
      dataQuality: {
        embeddingCoverage: embeddingCoverage,
        userMessagesChecked: embeddingStats?.length || 0
      }
    });
  } catch (error) {
    console.error('Validation check failed:', error);
    return json({ 
      status: 'error',
      error: 'Validation check failed',
      timestamp: new Date()
    }, { status: 500 });
  }
};
```

## 3.2 System Health Check

Create `/api/admin/chat/health/+server.ts`:

```typescript
import { json } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase.js';
import { generateEmbedding } from '$lib/server/embeddings.js';
import type { RequestHandler } from './$types.js';

export const GET: RequestHandler = async ({ request }) => {
  const checks = {
    database: false,
    embedding: false,
    logging: false
  };

  const results = {
    database: null as any,
    embedding: null as any,
    logging: null as any
  };

  // Test database connection
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('id')
      .limit(1);
    
    checks.database = !error;
    results.database = error ? error.message : 'Connected';
  } catch (error) {
    results.database = error instanceof Error ? error.message : 'Unknown error';
  }

  // Test embedding generation
  if (process.env.ENABLE_CHAT_LOGGING === 'true') {
    try {
      const testEmbedding = await generateEmbedding('test message');
      checks.embedding = Array.isArray(testEmbedding) && testEmbedding.length === 384;
      results.embedding = checks.embedding ? 'Generated 384-dim embedding' : 'Invalid embedding response';
    } catch (error) {
      results.embedding = error instanceof Error ? error.message : 'Embedding generation failed';
    }
  } else {
    checks.embedding = true; // N/A when logging disabled
    results.embedding = 'Disabled (logging off)';
  }

  // Test logging functionality
  if (process.env.ENABLE_CHAT_LOGGING === 'true') {
    try {
      // Create a test session
      const testToken = `health_check_${Date.now()}`;
      const { error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({
          session_token: testToken,
          user_identifier: 'health_check_user',
          device_type: 'test'
        });

      if (!sessionError) {
        // Clean up test session immediately
        await supabase
          .from('chat_sessions')
          .delete()
          .eq('session_token', testToken);
        
        checks.logging = true;
        results.logging = 'Test session created and cleaned up';
      } else {
        results.logging = sessionError.message;
      }
    } catch (error) {
      results.logging = error instanceof Error ? error.message : 'Logging test failed';
    }
  } else {
    checks.logging = true; // N/A when logging disabled
    results.logging = 'Disabled (logging off)';
  }

  const allHealthy = Object.values(checks).every(Boolean);

  return json({
    status: allHealthy ? 'healthy' : 'degraded',
    enabled: process.env.ENABLE_CHAT_LOGGING === 'true',
    checks,
    results,
    timestamp: new Date()
  });
};
```

## 3.3 Data Integrity Monitoring

Create `/api/admin/chat/integrity/+server.ts`:

```typescript
import { json } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase.js';
import type { RequestHandler } from './$types.js';

export const GET: RequestHandler = async ({ url }) => {
  const days = parseInt(url.searchParams.get('days') || '7');
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  try {
    // Check for orphaned messages (messages without sessions)
    const { data: orphanedMessages } = await supabase
      .from('chat_messages')
      .select('id, session_id')
      .not('session_id', 'in', 
        supabase.from('chat_sessions').select('id')
      )
      .gte('created_at', cutoffDate.toISOString());

    // Check for sessions with incorrect message counts
    const { data: sessionCounts } = await supabase.rpc('check_session_message_counts');

    // Check for duplicate session tokens
    const { data: duplicateTokens } = await supabase
      .from('chat_sessions')
      .select('session_token, count(*)')
      .gte('created_at', cutoffDate.toISOString())
      .group('session_token')
      .having('count(*)', 'gt', 1);

    // Check for messages with missing embeddings (user messages only)
    const { data: missingEmbeddings } = await supabase
      .from('chat_messages')
      .select('id, content')
      .eq('message_type', 'user')
      .is('embedding', null)
      .gte('created_at', cutoffDate.toISOString());

    // Check for unusual sequence order gaps
    const { data: sequenceIssues } = await supabase.rpc('check_sequence_integrity');

    const issues = {
      orphanedMessages: orphanedMessages?.length || 0,
      incorrectMessageCounts: sessionCounts?.length || 0,
      duplicateTokens: duplicateTokens?.length || 0,
      missingEmbeddings: missingEmbeddings?.length || 0,
      sequenceIssues: sequenceIssues?.length || 0
    };

    const totalIssues = Object.values(issues).reduce((sum, count) => sum + count, 0);

    return json({
      status: totalIssues === 0 ? 'clean' : 'issues_found',
      period: `${days} days`,
      issues,
      totalIssues,
      details: {
        orphanedMessages: orphanedMessages?.slice(0, 5), // First 5 examples
        missingEmbeddings: missingEmbeddings?.slice(0, 5)
      },
      checkedAt: new Date()
    });

  } catch (error) {
    console.error('Integrity check failed:', error);
    return json({
      status: 'error',
      error: 'Integrity check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};
```

## 3.4 Required Database Functions

Add these helper functions to your Supabase database:

```sql
-- Function to check session message counts
CREATE OR REPLACE FUNCTION check_session_message_counts()
RETURNS TABLE (
  session_id UUID,
  session_token VARCHAR,
  stored_count INTEGER,
  actual_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id as session_id,
    s.session_token,
    s.message_count as stored_count,
    COUNT(m.id) as actual_count
  FROM chat_sessions s
  LEFT JOIN chat_messages m ON s.id = m.session_id
  GROUP BY s.id, s.session_token, s.message_count
  HAVING s.message_count != COUNT(m.id);
END;
$$ LANGUAGE plpgsql;

-- Function to check sequence integrity
CREATE OR REPLACE FUNCTION check_sequence_integrity()
RETURNS TABLE (
  session_id UUID,
  expected_sequence INTEGER,
  actual_sequence INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH sequence_check AS (
    SELECT 
      m.session_id,
      ROW_NUMBER() OVER (PARTITION BY m.session_id ORDER BY m.created_at) as expected_seq,
      m.sequence_order as actual_seq
    FROM chat_messages m
  )
  SELECT 
    sc.session_id,
    sc.expected_seq::INTEGER,
    sc.actual_seq
  FROM sequence_check sc
  WHERE sc.expected_seq != sc.actual_seq;
END;
$$ LANGUAGE plpgsql;
```

## 3.5 Environment Variable Validation

Add environment validation to ensure proper configuration:

```typescript
// Create /lib/server/config-validation.ts
export function validateChatLoggingConfig(): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check if logging is enabled
  const loggingEnabled = process.env.ENABLE_CHAT_LOGGING === 'true';
  
  if (loggingEnabled) {
    // Check required environment variables
    if (!process.env.USER_ID_SALT) {
      issues.push('USER_ID_SALT environment variable is required');
    } else if (process.env.USER_ID_SALT === 'default-salt-change-this') {
      issues.push('USER_ID_SALT should be changed from default value');
    } else if (process.env.USER_ID_SALT.length < 32) {
      issues.push('USER_ID_SALT should be at least 32 characters long');
    }

    if (!process.env.HUGGING_FACE_INFERENCE_KEY) {
      issues.push('HUGGING_FACE_INFERENCE_KEY is required for embedding generation');
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      issues.push('Supabase configuration is required for data storage');
    }
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

// Add config validation endpoint
// /api/admin/chat/config/+server.ts
import { json } from '@sveltejs/kit';
import { validateChatLoggingConfig } from '$lib/server/config-validation.js';

export const GET: RequestHandler = async () => {
  const validation = validateChatLoggingConfig();
  
  return json({
    enabled: process.env.ENABLE_CHAT_LOGGING === 'true',
    valid: validation.valid,
    issues: validation.issues,
    environment: process.env.NODE_ENV || 'unknown',
    checkedAt: new Date()
  });
};
```

## 3.6 Success Criteria

- [ ] Validation endpoint shows data is being captured correctly
- [ ] Health check passes all system tests
- [ ] Integrity check finds no data consistency issues
- [ ] Environment configuration validated
- [ ] No orphaned sessions or messages detected
- [ ] Embedding coverage >95% for user messages
- [ ] Silent failure handling working (no UI errors)

## 3.7 Testing Phase 3

### Manual Validation

```bash
# Test validation endpoint
curl https://your-app.vercel.app/api/admin/chat/validate

# Test health check
curl https://your-app.vercel.app/api/admin/chat/health

# Test integrity check
curl https://your-app.vercel.app/api/admin/chat/integrity?days=7

# Test config validation
curl https://your-app.vercel.app/api/admin/chat/config
```

### Expected Responses

**Validation endpoint should return:**
```json
{
  "status": "ok",
  "timestamp": "2025-08-15T...",
  "enabled": true,
  "counts": {
    "totalSessions": 10,
    "totalMessages": 25,
    "recentSessions": 3,
    "recentMessages": 8,
    "sessionsWithoutMessages": 0,
    "errorsInLast24h": 0
  },
  "dataQuality": {
    "embeddingCoverage": 100,
    "userMessagesChecked": 12
  }
}
```

**Health check should return:**
```json
{
  "status": "healthy",
  "enabled": true,
  "checks": {
    "database": true,
    "embedding": true,
    "logging": true
  },
  "results": {
    "database": "Connected",
    "embedding": "Generated 384-dim embedding",
    "logging": "Test session created and cleaned up"
  }
}
```

### Database Validation Queries

```sql
-- Verify all recent sessions have messages
SELECT 
  s.session_token,
  s.message_count,
  COUNT(m.id) as actual_messages
FROM chat_sessions s
LEFT JOIN chat_messages m ON s.id = m.session_id
WHERE s.created_at > NOW() - INTERVAL '24 hours'
GROUP BY s.id, s.session_token, s.message_count
ORDER BY s.created_at DESC;

-- Check embedding success rate
SELECT 
  COUNT(*) as total_user_messages,
  COUNT(embedding) as messages_with_embeddings,
  ROUND(COUNT(embedding)::numeric / COUNT(*) * 100, 2) as success_rate
FROM chat_messages 
WHERE message_type = 'user'
AND created_at > NOW() - INTERVAL '24 hours';

-- Check for any errors
SELECT 
  session_id,
  message_type,
  error_message,
  created_at
FROM chat_messages 
WHERE error_message IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;
```

## 3.8 Monitoring Setup

### Create Simple Monitoring Script

```bash
#!/bin/bash
# monitoring/check-chat-logging.sh

echo "=== Chat Logging Health Check ==="
echo "Date: $(date)"
echo ""

# Check health endpoint
echo "Health Check:"
curl -s https://your-app.vercel.app/api/admin/chat/health | jq '.status, .checks'
echo ""

# Check validation
echo "Validation Check:"
curl -s https://your-app.vercel.app/api/admin/chat/validate | jq '.status, .counts'
echo ""

# Check integrity
echo "Integrity Check:"
curl -s https://your-app.vercel.app/api/admin/chat/integrity | jq '.status, .totalIssues'
echo ""

echo "=== End Health Check ==="
```

### Automated Monitoring (Optional)

```javascript
// monitoring/automated-check.js
// Run this daily via cron or GitHub Actions

const checkEndpoints = [
  '/api/admin/chat/health',
  '/api/admin/chat/validate', 
  '/api/admin/chat/integrity'
];

async function runChecks() {
  const results = [];
  
  for (const endpoint of checkEndpoints) {
    try {
      const response = await fetch(`https://your-app.vercel.app${endpoint}`);
      const data = await response.json();
      results.push({ endpoint, status: response.status, data });
    } catch (error) {
      results.push({ endpoint, error: error.message });
    }
  }
  
  console.log(JSON.stringify(results, null, 2));
  
  // Check for any issues
  const issues = results.filter(r => 
    r.status !== 200 || 
    r.data?.status === 'error' || 
    r.data?.status === 'degraded'
  );
  
  if (issues.length > 0) {
    console.error('Issues detected:', issues);
    process.exit(1);
  }
}

runChecks();
```

## Next Steps

Once Phase 3 is complete and all validation passes:
1. **Document** any issues found and resolution steps
2. **Establish** monitoring schedule (daily/weekly checks)
3. **Verify** system stability over 48-72 hours
4. **Proceed** to [Phase 4: Data Retention & Cleanup](./04-retention-cleanup.md)

**Important**: Phase 3 establishes your monitoring foundation. Don't skip the validation steps, as they'll help you catch issues early and maintain system reliability.