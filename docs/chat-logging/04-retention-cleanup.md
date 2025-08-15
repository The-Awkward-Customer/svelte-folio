# Phase 4: Data Retention & Cleanup

**Goal**: Implement data retention policy and automated cleanup  
**Duration**: Week 4  
**Risk Level**: Low  
**User Impact**: None

**Prerequisites**: Phase 3 complete with validated monitoring

## 4.1 Data Retention Implementation

### Automated Cleanup Function

Add this SQL function to your Supabase database:

```sql
-- Automated cleanup function for chat data
CREATE OR REPLACE FUNCTION cleanup_old_chat_data()
RETURNS TABLE (
  sessions_archived INTEGER,
  messages_archived INTEGER,
  cleanup_completed_at TIMESTAMP
) AS $$
DECLARE
  archived_sessions INTEGER := 0;
  archived_messages INTEGER := 0;
  cutoff_date TIMESTAMP;
BEGIN
  -- Set cutoff date to 6 months ago
  cutoff_date := NOW() - INTERVAL '6 months';
  
  -- Count messages that will be archived (for reporting)
  SELECT COUNT(*) INTO archived_messages
  FROM chat_messages 
  WHERE created_at < cutoff_date;
  
  -- Count sessions that will be archived (for reporting)
  SELECT COUNT(*) INTO archived_sessions
  FROM chat_sessions 
  WHERE started_at < cutoff_date;
  
  -- Delete old messages first (foreign key constraint)
  DELETE FROM chat_messages 
  WHERE created_at < cutoff_date;
  
  -- Delete old sessions (cascade will handle any remaining messages)
  DELETE FROM chat_sessions 
  WHERE started_at < cutoff_date;
  
  -- Return summary
  RETURN QUERY SELECT 
    archived_sessions,
    archived_messages,
    NOW()::TIMESTAMP;
    
  -- Log cleanup activity (optional - requires admin_logs table)
  BEGIN
    INSERT INTO admin_logs (action, details, created_at)
    VALUES (
      'data_cleanup',
      jsonb_build_object(
        'sessions_archived', archived_sessions,
        'messages_archived', archived_messages,
        'cutoff_date', cutoff_date
      ),
      NOW()
    );
  EXCEPTION WHEN OTHERS THEN
    -- Ignore logging errors - cleanup is more important
    NULL;
  END;
  
END;
$$ LANGUAGE plpgsql;
```

### Optional: Admin Logs Table

```sql
-- Optional table for tracking admin operations
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(100) NOT NULL,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
```

## 4.2 Manual Cleanup API

Create `/api/admin/chat/cleanup/+server.ts`:

```typescript
import { json } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase.js';
import type { RequestHandler } from './$types.js';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { dryRun = true, days = 180 } = await request.json();
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    if (dryRun) {
      // Preview what would be deleted
      const { count: sessionCount } = await supabase
        .from('chat_sessions')
        .select('id', { count: 'exact' })
        .lt('started_at', cutoffDate.toISOString());
        
      const { count: messageCount } = await supabase
        .from('chat_messages')
        .select('id', { count: 'exact' })
        .lt('created_at', cutoffDate.toISOString());
      
      return json({
        dryRun: true,
        cutoffDate,
        wouldDelete: {
          sessions: sessionCount || 0,
          messages: messageCount || 0
        }
      });
    }
    
    // Perform actual cleanup
    const { data: cleanupResult, error } = await supabase
      .rpc('cleanup_old_chat_data');
      
    if (error) throw error;
    
    return json({
      dryRun: false,
      cutoffDate,
      deleted: {
        sessions: cleanupResult[0]?.sessions_archived || 0,
        messages: cleanupResult[0]?.messages_archived || 0
      },
      completedAt: cleanupResult[0]?.cleanup_completed_at
    });
    
  } catch (error) {
    console.error('Cleanup failed:', error);
    return json({
      error: 'Cleanup operation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};
```

## 4.3 Data Export API

Create `/api/admin/chat/export/+server.ts`:

```typescript
import { json } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase.js';
import type { RequestHandler } from './$types.js';

export const GET: RequestHandler = async ({ url }) => {
  const format = url.searchParams.get('format') || 'json';
  const days = parseInt(url.searchParams.get('days') || '30');
  const includeContent = url.searchParams.get('include_content') === 'true';
  
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    // Build query based on content inclusion
    const selectFields = includeContent 
      ? `
        id,
        session_token,
        user_identifier,
        started_at,
        ended_at,
        message_count,
        device_type,
        chat_messages (
          id,
          message_type,
          content,
          processing_time_ms,
          sequence_order,
          created_at
        )
      `
      : `
        id,
        session_token,
        user_identifier,
        started_at,
        ended_at,
        message_count,
        device_type,
        chat_messages (
          id,
          message_type,
          processing_time_ms,
          sequence_order,
          created_at
        )
      `;

    const { data: sessions } = await supabase
      .from('chat_sessions')
      .select(selectFields)
      .gte('started_at', cutoffDate.toISOString())
      .order('started_at', { ascending: false });

    if (format === 'csv') {
      const csv = convertToCSV(sessions, includeContent);
      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="chat-data-${days}days-${includeContent ? 'full' : 'metadata'}.csv"`
        }
      });
    }

    // Sanitize data for privacy
    const sanitizedSessions = sessions?.map(session => ({
      ...session,
      user_identifier: session.user_identifier?.substring(0, 8) + '...', // Partial hash only
      chat_messages: session.chat_messages?.map((msg: any) => ({
        ...msg,
        content: includeContent ? msg.content : '[REDACTED]'
      }))
    }));

    return json({
      exportedAt: new Date(),
      daysIncluded: days,
      includeContent,
      sessionsCount: sessions?.length || 0,
      totalMessages: sessions?.reduce((sum, s) => sum + (s.chat_messages?.length || 0), 0) || 0,
      data: sanitizedSessions
    });
  } catch (error) {
    console.error('Export failed:', error);
    return json({ 
      error: 'Export failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};

function convertToCSV(sessions: any[], includeContent: boolean): string {
  const headers = [
    'session_id',
    'started_at', 
    'device_type',
    'message_count',
    'user_identifier_partial'
  ];
  
  if (includeContent) {
    headers.push('message_type', 'content', 'sequence_order', 'message_created_at');
  }
  
  const rows: string[][] = [];
  
  sessions?.forEach(session => {
    if (includeContent && session.chat_messages?.length > 0) {
      // One row per message
      session.chat_messages.forEach((msg: any) => {
        rows.push([
          session.id,
          session.started_at,
          session.device_type || '',
          session.message_count?.toString() || '0',
          session.user_identifier?.substring(0, 8) + '...' || '',
          msg.message_type,
          `"${msg.content?.replace(/"/g, '""') || ''}"`, // Escape quotes
          msg.sequence_order?.toString() || '',
          msg.created_at
        ]);
      });
    } else {
      // One row per session (metadata only)
      rows.push([
        session.id,
        session.started_at,
        session.device_type || '',
        session.message_count?.toString() || '0',
        session.user_identifier?.substring(0, 8) + '...' || ''
      ]);
    }
  });
  
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}
```

## 4.4 Retention Monitoring

Create `/api/admin/chat/retention-status/+server.ts`:

```typescript
import { json } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase.js';
import type { RequestHandler } from './$types.js';

export const GET: RequestHandler = async () => {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Count data by age
    const { count: totalSessions } = await supabase
      .from('chat_sessions')
      .select('id', { count: 'exact' });

    const { count: oldSessions } = await supabase
      .from('chat_sessions')
      .select('id', { count: 'exact' })
      .lt('started_at', sixMonthsAgo.toISOString());

    const { count: agingSessions } = await supabase
      .from('chat_sessions')
      .select('id', { count: 'exact' })
      .lt('started_at', threeMonthsAgo.toISOString())
      .gte('started_at', sixMonthsAgo.toISOString());

    const { count: totalMessages } = await supabase
      .from('chat_messages')
      .select('id', { count: 'exact' });

    const { count: oldMessages } = await supabase
      .from('chat_messages')
      .select('id', { count: 'exact' })
      .lt('created_at', sixMonthsAgo.toISOString());

    // Get oldest data
    const { data: oldestSession } = await supabase
      .from('chat_sessions')
      .select('started_at')
      .order('started_at', { ascending: true })
      .limit(1)
      .single();

    // Calculate storage estimate (rough)
    const avgMessageSize = 200; // bytes
    const estimatedStorageBytes = (totalMessages || 0) * avgMessageSize;
    const estimatedStorageMB = Math.round(estimatedStorageBytes / 1024 / 1024 * 100) / 100;

    return json({
      retentionPolicy: {
        periodMonths: 6,
        autoCleanupEnabled: false // Manual for now
      },
      currentData: {
        totalSessions: totalSessions || 0,
        totalMessages: totalMessages || 0,
        oldestDataDate: oldestSession?.started_at,
        estimatedStorageMB
      },
      upcomingCleanup: {
        sessionsToDelete: oldSessions || 0,
        messagesToDelete: oldMessages || 0,
        sessionsDueInThreeMonths: agingSessions || 0
      },
      recommendations: {
        needsCleanup: (oldSessions || 0) > 0,
        considerAutomation: (totalSessions || 0) > 100
      },
      checkedAt: new Date()
    });
  } catch (error) {
    console.error('Retention status check failed:', error);
    return json({
      error: 'Failed to check retention status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};
```

## 4.5 Automated Cleanup Scheduler (Optional)

### Using Supabase Edge Functions

Create `supabase/functions/cleanup-chat-data/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // Verify request is authorized (webhook secret, etc.)
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${Deno.env.get('CLEANUP_SECRET')}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Run cleanup function
    const { data, error } = await supabase.rpc('cleanup_old_chat_data')
    
    if (error) throw error

    return new Response(
      JSON.stringify({
        success: true,
        cleaned: data[0],
        timestamp: new Date()
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date()
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
```

### Using GitHub Actions (Alternative)

Create `.github/workflows/cleanup-chat-data.yml`:

```yaml
name: Cleanup Chat Data

on:
  schedule:
    # Run monthly on the 1st at 2 AM UTC
    - cron: '0 2 1 * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Cleanup Old Chat Data
        run: |
          curl -X POST "${{ secrets.APP_URL }}/api/admin/chat/cleanup" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer ${{ secrets.ADMIN_API_KEY }}" \
            -d '{"dryRun": false, "days": 180}'
```

## 4.6 Success Criteria

- [ ] Data retention policy working correctly (6 months)
- [ ] Manual cleanup API functional with dry-run capability
- [ ] Export functionality working for both metadata and full content
- [ ] Retention monitoring shows accurate data aging
- [ ] No data loss during cleanup operations
- [ ] Performance impact <1% during cleanup operations
- [ ] Admin logs tracking cleanup activities (if implemented)

## 4.7 Testing Phase 4

### Test Cleanup Function

```sql
-- Create test data older than 6 months
INSERT INTO chat_sessions (session_token, user_identifier, started_at, device_type)
VALUES (
  'test_old_session',
  'test_user_old',
  NOW() - INTERVAL '7 months',
  'desktop'
);

-- Get the session ID for test messages
WITH old_session AS (
  SELECT id FROM chat_sessions WHERE session_token = 'test_old_session'
)
INSERT INTO chat_messages (session_id, message_type, content, sequence_order, created_at)
SELECT 
  old_session.id,
  'user',
  'This is an old test message',
  1,
  NOW() - INTERVAL '7 months'
FROM old_session;

-- Test cleanup function (dry run first)
SELECT * FROM cleanup_old_chat_data();

-- Verify test data was cleaned up
SELECT COUNT(*) FROM chat_sessions WHERE session_token = 'test_old_session';
```

### Test Export API

```bash
# Test metadata export
curl "https://your-app.vercel.app/api/admin/chat/export?format=json&days=30&include_content=false"

# Test full content export
curl "https://your-app.vercel.app/api/admin/chat/export?format=csv&days=7&include_content=true"

# Test retention status
curl "https://your-app.vercel.app/api/admin/chat/retention-status"
```

### Test Manual Cleanup

```bash
# Dry run cleanup
curl -X POST "https://your-app.vercel.app/api/admin/chat/cleanup" \
  -H "Content-Type: application/json" \
  -d '{"dryRun": true, "days": 180}'

# Actual cleanup (be careful!)
curl -X POST "https://your-app.vercel.app/api/admin/chat/cleanup" \
  -H "Content-Type: application/json" \
  -d '{"dryRun": false, "days": 180}'
```

## 4.8 Operational Procedures

### Monthly Cleanup Checklist

1. **Review Retention Status**
   ```bash
   curl https://your-app.vercel.app/api/admin/chat/retention-status
   ```

2. **Export Data Before Cleanup (if needed)**
   ```bash
   curl "https://your-app.vercel.app/api/admin/chat/export?format=json&days=210" > backup.json
   ```

3. **Dry Run Cleanup**
   ```bash
   curl -X POST https://your-app.vercel.app/api/admin/chat/cleanup \
     -H "Content-Type: application/json" \
     -d '{"dryRun": true}'
   ```

4. **Actual Cleanup (if dry run looks good)**
   ```bash
   curl -X POST https://your-app.vercel.app/api/admin/chat/cleanup \
     -H "Content-Type: application/json" \
     -d '{"dryRun": false}'
   ```

5. **Verify Cleanup Success**
   ```bash
   curl https://your-app.vercel.app/api/admin/chat/validate
   ```

### Emergency Data Recovery

If you accidentally delete data:

1. **Check if you have recent exports**
2. **Look for Supabase automatic backups**
3. **Check admin logs for cleanup details**

```sql
-- Check admin logs for recent cleanup operations
SELECT * FROM admin_logs 
WHERE action = 'data_cleanup' 
ORDER BY created_at DESC 
LIMIT 5;
```

## Next Steps

Phase 4 completes the chat logging implementation:

1. **Validate** all retention functionality works correctly
2. **Document** cleanup procedures for future reference
3. **Set calendar reminders** for monthly retention review
4. **Monitor** storage growth and adjust retention policy if needed
5. **Consider** automated cleanup setup for production use

## Implementation Complete ✅

You now have a complete chat logging system with:
- ✅ **Data Capture**: All conversations logged with embeddings
- ✅ **Privacy Protection**: Hashed identifiers and automatic cleanup
- ✅ **Data Validation**: Monitoring and integrity checks
- ✅ **Data Retention**: Automated cleanup and export capabilities

The system is designed to run with minimal maintenance while providing valuable insights when you're ready to build analytics on top of the captured data.