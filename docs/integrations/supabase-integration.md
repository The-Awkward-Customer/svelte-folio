# Supabase Integration Documentation
*Created: 2025-09-26 16:31:00 UTC*

## Overview

This document covers the complete Supabase integration for the Svelte Portfolio Application, including local development setup, Edge Functions, and production deployment configuration.

## Table of Contents

- [Local Development Setup](#local-development-setup)
- [Configuration](#configuration)
- [Edge Functions](#edge-functions)
- [Database Integration](#database-integration)
- [Environment Variables](#environment-variables)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)

## Local Development Setup

### Prerequisites

- **Supabase CLI** >= 1.0.0
- **Docker** (for local Supabase stack)
- **Node.js** >= 18.0.0

### Installation

```bash
# Install Supabase CLI globally
npm install -g supabase

# Verify installation
supabase --version
```

### Initial Setup

```bash
# From project root directory
cd svelte-folio

# Start Supabase local development stack
supabase start

# This command will:
# 1. Pull required Docker images
# 2. Start PostgreSQL database
# 3. Start Supabase services (API, Auth, Storage, etc.)
# 4. Apply any existing migrations
# 5. Display connection details
```

### Service Ports

When `supabase start` is running, the following services are available:

| Service | URL | Purpose |
|---------|-----|---------|
| Supabase Studio | http://127.0.0.1:54323 | Database management UI |
| PostgreSQL | http://127.0.0.1:54322 | Direct database connection |
| Supabase API | http://127.0.0.1:54321 | REST API endpoint |
| Edge Functions | http://127.0.0.1:54321/functions/v1 | Serverless function runtime |
| Inbucket (Email) | http://127.0.0.1:54324 | Email testing interface |
| Storage | http://127.0.0.1:54321/storage/v1 | File storage API |

## Configuration

### Main Configuration File

The Supabase configuration is defined in `/supabase/config.toml`:

```toml
project_id = "svelte-folio"

[api]
enabled = true
port = 54321
schemas = ["public", "graphql_public"]

[db]
port = 54322
major_version = 17

[studio]
enabled = true
port = 54323
api_url = "http://127.0.0.1"
openai_api_key = "env(OPENAI_API_KEY)"

[auth]
enabled = true
site_url = "http://127.0.0.1:3000"
enable_signup = true

[storage]
enabled = true
file_size_limit = "50MiB"

[edge_runtime]
enabled = true
policy = "per_worker"
deno_version = 2
```

### Key Configuration Sections

#### Database Configuration
- **Port**: 54322 (local PostgreSQL)
- **Version**: PostgreSQL 17
- **Schemas**: Exposes `public` and `graphql_public` schemas

#### Authentication
- **Site URL**: Configured for local development
- **Signup**: Enabled for testing
- **JWT Expiry**: 3600 seconds (1 hour)

#### Edge Runtime
- **Policy**: `per_worker` (enables hot reload)
- **Deno Version**: 2 (latest)
- **Inspector Port**: 8083 (for debugging)

## Edge Functions

### Keep-Alive Function

The project includes a critical keep-alive Edge Function to prevent database hibernation in production.

#### Location
```
supabase/functions/keep-alive/
├── index.ts        # Main function code
├── deno.json       # Deno configuration
└── .npmrc          # NPM configuration
```

#### Purpose
- **Prevents Database Hibernation**: Supabase free tier databases hibernate after inactivity
- **Maintains Service Availability**: Ensures the chat/QA system remains responsive
- **Simple Health Check**: Performs minimal database query to maintain connection

#### Function Implementation

```typescript
// supabase/functions/keep-alive/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  // Handle CORS for browser requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Simple query to keep database active
    const { data, error } = await supabaseClient
      .from('qa_pairs')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Keep-alive query failed:', error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`Database kept alive at ${new Date().toISOString()}`)

    return new Response(JSON.stringify({
      success: true,
      timestamp: new Date().toISOString(),
      message: 'Database is active'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
```

#### Configuration in config.toml

```toml
[functions.keep-alive]
enabled = true
verify_jwt = true
import_map = "./functions/keep-alive/deno.json"
entrypoint = "./functions/keep-alive/index.ts"
```

### Testing Edge Functions Locally

```bash
# Start Edge Functions runtime
supabase functions serve

# Test the keep-alive function
curl -X POST http://127.0.0.1:54321/functions/v1/keep-alive \
  -H "Authorization: Bearer <your_anon_key>" \
  -H "Content-Type: application/json"

# Expected response
{
  "success": true,
  "timestamp": "2025-09-26T16:31:00.000Z",
  "message": "Database is active"
}
```

### Deploying Edge Functions

```bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy keep-alive

# Check function logs
supabase functions logs keep-alive
```

## Database Integration

### Schema Management

The application uses Drizzle ORM with the following table structure:

#### Core Tables
- **qa_pairs**: Question-answer content
- **qa_embeddings**: Vector embeddings for semantic search
- **rate_limits**: API rate limiting
- **unanswered_questions**: Analytics for unmatched queries

#### Migration Workflow

```bash
# From frontend/ directory
npm run db:push      # Push schema changes to local DB
npm run db:migrate   # Generate and apply migrations
npm run db:studio    # Open Drizzle Studio for inspection
```

### Vector Search Integration

The database includes pgVector extension for semantic search:

```sql
-- Example vector similarity query
SELECT
  qa.question,
  qa.answer,
  (1 - (emb.embedding <=> $1::vector)) as similarity
FROM qa_pairs qa
JOIN qa_embeddings emb ON qa.id = emb.qa_id
WHERE (1 - (emb.embedding <=> $1::vector)) > 0.7
ORDER BY similarity DESC
LIMIT 5;
```

## Environment Variables

### Required Variables

Create `.env.local` in the frontend directory:

```env
# Supabase Configuration
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=<your_local_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<your_local_service_role_key>

# Database Connection
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres

# Additional APIs
OPENAI_API_KEY=<your_openai_key>
HUGGINGFACE_API_KEY=<your_huggingface_key>
```

### Getting Local Keys

After running `supabase start`, the command output will display:

```
Supabase Local:
  - API URL: http://127.0.0.1:54321
  - anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  - service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Copy these values to your `.env.local` file.

### Production Variables

For production deployment, configure these in your hosting platform:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=<production_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<production_service_role_key>
DATABASE_URL=<production_postgres_url>
```

## Development Workflow

### Daily Development

1. **Start Services**
   ```bash
   # From project root
   supabase start

   # Check all services are running
   supabase status
   ```

2. **Development Server**
   ```bash
   # From frontend/ directory
   npm run dev
   ```

3. **Database Operations**
   ```bash
   # Apply schema changes
   npm run db:push

   # View data in Drizzle Studio
   npm run db:studio

   # Or use Supabase Studio
   # Open http://127.0.0.1:54323
   ```

### Schema Changes

1. **Modify Schema**
   - Edit `/frontend/src/lib/server/qa.ts`
   - Update table definitions using Drizzle ORM

2. **Apply Changes**
   ```bash
   npm run db:push
   ```

3. **Generate Migration** (for production)
   ```bash
   supabase db diff --schema public
   ```

### Data Management

```bash
# Import Q&A data
npm run ingest

# Reset database with fresh data
supabase db reset

# Backup local database
supabase db dump --local > backup.sql
```

## Troubleshooting

### Common Issues

#### 1. Services Not Starting

```bash
# Check Docker is running
docker ps

# Stop and restart Supabase
supabase stop
supabase start

# Check for port conflicts
lsof -i :54321
```

#### 2. Database Connection Issues

```bash
# Verify database is accessible
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres

# Check environment variables
echo $DATABASE_URL

# Restart with fresh database
supabase db reset
```

#### 3. Edge Function Errors

```bash
# Check function logs
supabase functions logs keep-alive

# Test function locally
curl -X POST http://127.0.0.1:54321/functions/v1/keep-alive \
  -H "Authorization: Bearer $(supabase status | grep 'anon key' | cut -d: -f2 | xargs)"
```

#### 4. Migration Issues

```bash
# Reset to clean state
supabase db reset

# Reapply schema
cd frontend
npm run db:push
```

### Debug Mode

Enable debug logging for detailed troubleshooting:

```bash
# Set debug environment variable
export SUPABASE_DEBUG=true

# Start with verbose logging
supabase start --debug
```

### Performance Monitoring

Monitor service performance:

```bash
# Check service health
supabase status

# Monitor database queries
# Open Supabase Studio → Database → Query Stats

# Check Edge Function performance
supabase functions logs --level debug
```

## Related Documentation

- [Database Overview](/docs/architecture/database/overview.md)
- [Chat Implementation](/docs/components/chat/Chat-Implementation-Complete-Documentation.md)
- [Main README](/README.md)

## Production Deployment

### Supabase Project Setup

1. **Create Project**
   - Visit [supabase.com](https://supabase.com)
   - Create new project
   - Note project URL and keys

2. **Deploy Schema**
   ```bash
   supabase link --project-ref <project-ref>
   supabase db push
   ```

3. **Deploy Edge Functions**
   ```bash
   supabase functions deploy
   ```

4. **Configure Secrets**
   ```bash
   supabase secrets set OPENAI_API_KEY=<your_key>
   ```

### Monitoring

- **Supabase Dashboard**: Monitor database usage, function calls
- **Function Logs**: Track keep-alive function execution
- **Database Metrics**: Query performance, connection counts

---

*This documentation covers the complete Supabase integration as of September 26, 2025. For the latest updates, refer to the Supabase CLI documentation and project changelog.*