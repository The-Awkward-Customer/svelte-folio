# Phase 1: Database Schema & Session Tracking

**Goal**: Set up database schema and basic session tracking  
**Duration**: Week 1  
**Risk Level**: Low  
**User Impact**: None (no user-facing changes)

## 1.1 Database Schema Setup

### Core Tables

```sql
-- Core tables for data capture
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token VARCHAR(255) UNIQUE NOT NULL,
  user_identifier VARCHAR(255), -- hashed IP + user agent
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  message_count INTEGER DEFAULT 0,
  user_agent TEXT,
  referrer TEXT,
  device_type VARCHAR(20), -- mobile, desktop, tablet
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  message_type VARCHAR(20) NOT NULL, -- 'user' | 'assistant'
  content TEXT NOT NULL,
  embedding VECTOR(384), -- Store user question embeddings
  similar_qa_matches JSONB, -- Store matched Q&As for reference
  similarity_scores REAL[],
  processing_time_ms INTEGER,
  error_message TEXT,
  sequence_order INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Performance Indexes

```sql
-- Basic indexes for performance
CREATE INDEX idx_chat_sessions_started_at ON chat_sessions(started_at);
CREATE INDEX idx_chat_sessions_user_identifier ON chat_sessions(user_identifier);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX idx_chat_messages_type ON chat_messages(message_type);
```

### Deployment Instructions

**For Supabase:**
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the table creation scripts above
4. Verify tables exist in the Table Editor

## 1.2 Session Management Store

Create `/lib/stores/chatSessionStore.svelte.ts`:

```typescript
// Session management for chat logging
class ChatSessionManager {
  #sessionToken = $state<string | null>(null);
  #isActive = $state(false);

  get sessionToken() { return this.#sessionToken; }
  get isActive() { return this.#isActive; }

  async startSession(): Promise<void> {
    if (this.#isActive) return;

    this.#sessionToken = this.generateSessionToken();
    const deviceInfo = this.getDeviceInfo();
    
    try {
      await fetch('/api/chat/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken: this.#sessionToken,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          deviceType: deviceInfo.type
        })
      });
      
      this.#isActive = true;
    } catch (error) {
      console.error('Failed to start session:', error);
      // Continue without session tracking - silent failure
    }
  }

  private generateSessionToken(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceInfo() {
    const width = window.innerWidth;
    const type = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
    return { type, width, height: window.innerHeight };
  }
}

export const chatSession = new ChatSessionManager();
```

## 1.3 Session API Endpoints

Create `/api/chat/session/start/+server.ts`:

```typescript
import { json } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase.js';
import type { RequestHandler } from './$types.js';

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
  // Check if logging is enabled
  if (process.env.ENABLE_CHAT_LOGGING !== 'true') {
    return json({ success: true, disabled: true });
  }

  try {
    const { sessionToken, userAgent, referrer, deviceType } = await request.json();
    
    // Create hashed user identifier
    const clientIP = getClientAddress();
    const userIdentifier = await createHashedIdentifier(clientIP, userAgent);

    const { error } = await supabase
      .from('chat_sessions')
      .insert({
        session_token: sessionToken,
        user_identifier: userIdentifier,
        user_agent: userAgent,
        referrer,
        device_type: deviceType
      });

    if (error) {
      console.error('Session creation error:', error);
      return json({ error: 'Failed to create session' }, { status: 500 });
    }

    return json({ success: true });
  } catch (error) {
    console.error('Session start error:', error);
    return json({ error: 'Session start failed' }, { status: 500 });
  }
};

async function createHashedIdentifier(ip: string, userAgent: string): Promise<string> {
  const salt = process.env.USER_ID_SALT || 'default-salt-change-this';
  const data = `${ip}:${userAgent}:${salt}`;
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
}
```

## 1.4 Environment Variables Setup

Add to your environment (Vercel, `.env.local`, etc.):

```bash
# Chat logging toggle
ENABLE_CHAT_LOGGING=true

# Generate a secure salt (run this command):
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
USER_ID_SALT=your-generated-salt-here
```

**To generate a secure salt:**
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL (if available)
openssl rand -hex 32
```

## 1.5 Success Criteria

- [ ] Database schema deployed without errors
- [ ] Session creation working in browser dev tools
- [ ] Hash generation producing consistent identifiers
- [ ] No performance impact on existing chat
- [ ] Error logging capturing any issues
- [ ] Environment toggle working (`ENABLE_CHAT_LOGGING=false` disables logging)

## 1.6 Testing Phase 1

### Database Verification
```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('chat_sessions', 'chat_messages');

-- Check indexes exist
SELECT indexname FROM pg_indexes 
WHERE tablename IN ('chat_sessions', 'chat_messages');
```

### API Testing
```bash
# Test session creation
curl -X POST https://your-app.vercel.app/api/chat/session/start \
  -H "Content-Type: application/json" \
  -d '{
    "sessionToken": "test_123",
    "userAgent": "Mozilla/5.0 (test)",
    "referrer": "https://example.com",
    "deviceType": "desktop"
  }'

# Expected response: {"success": true}
```

### Browser Testing
```javascript
// Test in browser console
fetch('/api/chat/session/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionToken: 'test_' + Date.now(),
    userAgent: navigator.userAgent,
    referrer: document.referrer,
    deviceType: window.innerWidth < 768 ? 'mobile' : 'desktop'
  })
}).then(r => r.json()).then(console.log);
```

### Supabase Verification
```sql
-- Check data is being inserted
SELECT COUNT(*) as session_count FROM chat_sessions;
SELECT session_token, device_type, created_at FROM chat_sessions ORDER BY created_at DESC LIMIT 5;
```

## 1.7 Troubleshooting

### Common Issues

**"Table doesn't exist" errors:**
- Verify you ran the CREATE TABLE statements in Supabase
- Check you're connected to the right database/project

**"USER_ID_SALT not defined" errors:**
- Ensure environment variable is set in Vercel
- Check `.env.local` file for local development
- Verify the salt is a hex string (no spaces or special characters)

**Session creation failing silently:**
- Check `ENABLE_CHAT_LOGGING` is set to `'true'` (string, not boolean)
- Verify Supabase connection and permissions
- Check browser network tab for API errors

### Validation Queries
```sql
-- Check hash consistency (same IP/UA should produce same hash)
SELECT user_identifier, COUNT(*) as sessions 
FROM chat_sessions 
GROUP BY user_identifier 
HAVING COUNT(*) > 1;

-- Check device type distribution
SELECT device_type, COUNT(*) as count 
FROM chat_sessions 
GROUP BY device_type;
```

## Next Steps

Once Phase 1 is complete and validated:
1. **Verify** all success criteria are met
2. **Test** session creation in staging environment  
3. **Monitor** for 24-48 hours to ensure stability
4. **Proceed** to [Phase 2: Message Logging](./02-message-logging.md)

**Important**: Don't proceed to Phase 2 until Phase 1 is working reliably, as Phase 2 depends on session tracking.