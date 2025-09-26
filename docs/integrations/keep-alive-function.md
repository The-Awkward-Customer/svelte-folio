# Keep-Alive Edge Function Documentation
*Created: 2025-09-26 16:35:00 UTC*

## Overview

The keep-alive Edge Function is a critical component of the Svelte Portfolio Application that prevents database hibernation in Supabase's free tier by maintaining regular database activity.

## Problem Statement

### Database Hibernation Issue

Supabase free tier databases automatically hibernate after a period of inactivity, which can cause:
- **Service Disruption**: First user request after hibernation experiences significant delay (cold start)
- **Poor User Experience**: Chat/QA features become unresponsive
- **Lost Sessions**: Active user sessions may be interrupted

### Solution

The keep-alive function performs periodic database queries to maintain database activity, ensuring:
- **Consistent Performance**: Database remains active and responsive
- **Seamless User Experience**: No cold start delays
- **Reliable Service**: Chat and QA features remain available 24/7

## Function Implementation

### File Structure

```
supabase/functions/keep-alive/
├── index.ts        # Main Edge Function implementation
├── deno.json       # Deno runtime configuration
└── .npmrc          # NPM registry configuration
```

### Core Implementation

```typescript
// supabase/functions/keep-alive/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with environment variables
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Perform minimal database query to maintain activity
    const { data, error } = await supabaseClient
      .from('qa_pairs')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Keep-alive query failed:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }

    // Log successful execution
    console.log(`Database kept alive at ${new Date().toISOString()}`)

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        message: 'Database is active'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
```

### Configuration Files

#### deno.json
```json
{
  "imports": {}
}
```

#### .npmrc
```
@supabase:registry=https://npm.pkg.github.com/
```

## Function Configuration

### Supabase Configuration

The function is configured in `/supabase/config.toml`:

```toml
[functions.keep-alive]
enabled = true
verify_jwt = true
import_map = "./functions/keep-alive/deno.json"
entrypoint = "./functions/keep-alive/index.ts"
```

### Configuration Options

- **enabled**: `true` - Function is active and deployable
- **verify_jwt**: `true` - Requires valid JWT for authentication
- **import_map**: Path to Deno import map for dependencies
- **entrypoint**: Main function file to execute

## How It Works

### Execution Flow

1. **HTTP Request**: Function receives POST request (typically from scheduled job)
2. **CORS Handling**: Processes preflight OPTIONS requests for browser compatibility
3. **Database Connection**: Creates Supabase client using environment variables
4. **Query Execution**: Performs minimal SELECT query on `qa_pairs` table
5. **Response**: Returns success/failure status with timestamp
6. **Logging**: Records execution time for monitoring

### Query Strategy

The function uses a minimal query to avoid overhead:

```sql
SELECT id FROM qa_pairs LIMIT 1;
```

This query:
- **Minimal Resource Usage**: Only selects a single field and row
- **Fast Execution**: Index-based lookup with LIMIT 1
- **Reliable**: Uses existing table guaranteed to have data
- **Low Impact**: Doesn't interfere with application operations

## Deployment

### Local Testing

```bash
# Start Supabase Edge Functions locally
supabase functions serve

# Test the function
curl -X POST http://127.0.0.1:54321/functions/v1/keep-alive \
  -H "Authorization: Bearer <your_anon_key>" \
  -H "Content-Type: application/json"

# Expected response
{
  "success": true,
  "timestamp": "2025-09-26T16:35:00.000Z",
  "message": "Database is active"
}
```

### Production Deployment

```bash
# Deploy to Supabase
supabase functions deploy keep-alive

# Verify deployment
supabase functions list

# Check function logs
supabase functions logs keep-alive
```

## Scheduling & Automation

### Production Scheduling

In production, the keep-alive function should be called regularly. Common approaches:

#### 1. Cron Jobs (Recommended)

Set up a cron job or scheduled task to call the function every 10-15 minutes:

```bash
# Example cron job (every 15 minutes)
*/15 * * * * curl -X POST https://your-project.supabase.co/functions/v1/keep-alive \
  -H "Authorization: Bearer <anon_key>" \
  -H "Content-Type: application/json" > /dev/null 2>&1
```

#### 2. GitHub Actions

```yaml
# .github/workflows/keep-alive.yml
name: Keep Database Alive
on:
  schedule:
    - cron: '*/15 * * * *'  # Every 15 minutes

jobs:
  keep-alive:
    runs-on: ubuntu-latest
    steps:
      - name: Call keep-alive function
        run: |
          curl -X POST ${{ secrets.SUPABASE_URL }}/functions/v1/keep-alive \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Content-Type: application/json"
```

#### 3. External Monitoring Services

Use services like:
- **UptimeRobot**: Monitor function endpoint with regular checks
- **Pingdom**: Schedule HTTP requests to function URL
- **Healthchecks.io**: Set up scheduled pings

### Timing Considerations

- **Frequency**: Every 10-15 minutes is sufficient
- **Peak Hours**: More frequent calls during high-traffic periods
- **Timezone**: Consider user timezone patterns
- **Redundancy**: Multiple scheduling methods for reliability

## Monitoring & Debugging

### Function Logs

Monitor function execution:

```bash
# View recent logs
supabase functions logs keep-alive

# Real-time monitoring
supabase functions logs keep-alive --follow

# Filter by log level
supabase functions logs keep-alive --level error
```

### Success Metrics

Monitor these indicators:
- **Execution Frequency**: Function called regularly
- **Success Rate**: > 95% successful responses
- **Response Time**: < 500ms average
- **Database Uptime**: No hibernation events

### Common Issues

#### 1. Authentication Errors

```json
{
  "error": "Invalid JWT token"
}
```

**Solution**: Verify `SUPABASE_ANON_KEY` is correct and has proper permissions.

#### 2. Database Connection Failures

```json
{
  "error": "relation \"qa_pairs\" does not exist"
}
```

**Solution**: Ensure database schema is deployed and `qa_pairs` table exists.

#### 3. Environment Variable Issues

```json
{
  "error": "SUPABASE_URL is not defined"
}
```

**Solution**: Check Supabase function environment variables are properly configured.

### Debug Mode

Enable detailed logging for troubleshooting:

```typescript
// Add to function for debugging
console.log('Environment variables:', {
  url: Deno.env.get('SUPABASE_URL') ? 'set' : 'missing',
  key: Deno.env.get('SUPABASE_ANON_KEY') ? 'set' : 'missing'
});
```

## Security Considerations

### Authentication

- **JWT Verification**: Function requires valid JWT token
- **Anon Key Usage**: Uses public anon key for read-only operations
- **CORS Headers**: Properly configured for cross-origin requests

### Data Privacy

- **Minimal Data Access**: Only reads record IDs, no sensitive data
- **No Data Storage**: Function doesn't store or persist any information
- **Audit Trail**: All executions logged for monitoring

### Rate Limiting

Consider implementing rate limiting:

```typescript
// Example rate limiting logic
const rateLimitKey = `keep-alive:${new Date().getHours()}`;
// Implement rate limit check here
```

## Cost Considerations

### Supabase Edge Functions

- **Free Tier**: 500,000 function invocations per month
- **Keep-Alive Usage**: ~3,000 invocations per month (every 15 minutes)
- **Impact**: < 1% of free tier allocation

### Database Resources

- **Query Cost**: Minimal SELECT operation
- **Connection Overhead**: Single connection per invocation
- **Storage Impact**: No additional storage used

## Alternatives

### Other Approaches

1. **Application-Level Keep-Alive**
   - Client-side periodic requests
   - Server-side background jobs
   - Less reliable, dependent on active users

2. **Database Triggers**
   - Scheduled database functions
   - Requires database configuration
   - May not prevent hibernation

3. **Paid Tier Migration**
   - Upgrade to Supabase Pro
   - Eliminates hibernation entirely
   - Higher cost but more reliable

### Migration Path

When ready to migrate away from keep-alive:

```bash
# Disable function
supabase functions deploy keep-alive --no-verify-jwt

# Remove from config.toml
# [functions.keep-alive]
# enabled = false

# Stop scheduled calls
# Remove cron jobs or GitHub Actions
```

## Related Documentation

- [Supabase Integration Overview](/docs/integrations/supabase-integration.md)
- [Database Overview](/docs/architecture/database/overview.md)
- [Edge Functions Documentation](https://supabase.com/docs/guides/functions)

---

*This keep-alive function is essential for maintaining service availability on Supabase's free tier. Monitor its execution regularly and consider upgrading to a paid tier for production applications requiring guaranteed uptime.*