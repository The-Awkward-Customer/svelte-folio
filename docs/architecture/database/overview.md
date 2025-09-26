# Database Overview
*Last Updated: 2025-09-26 16:38:00 UTC*

This document outlines the complete database structure and development workflow for the Svelte Folio application, including local development with Supabase and production deployment.

## Technology Stack

- **Database**: PostgreSQL 17 with pgVector extension
- **Provider**: Supabase (local development + production)
- **ORM**: Drizzle ORM
- **Vector Dimensions**: 384 (sentence-transformers embeddings)
- **Local Development**: Supabase CLI with Docker
- **Edge Functions**: Deno runtime for serverless functions

## Schema Definition

The database schema is defined in `/frontend/src/lib/server/qa.ts` using Drizzle ORM.

## Tables

### 1. `qa_pairs`
Core Q&A content storage.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT random | Unique identifier |
| `question` | TEXT | NOT NULL | The question text |
| `answer` | TEXT | NOT NULL | The answer text |
| `category` | VARCHAR(100) | NULLABLE | Optional categorization |
| `tags` | TEXT[] | NULLABLE | Array of tags |
| `created_at` | TIMESTAMP | DEFAULT NOW | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT NOW | Last update timestamp |

### 2. `qa_embeddings`
Vector embeddings for semantic search functionality.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT random | Unique identifier |
| `qa_id` | UUID | FOREIGN KEY → qa_pairs.id, CASCADE DELETE | Reference to Q&A pair |
| `content` | TEXT | NOT NULL | The text that was embedded |
| `embedding` | VECTOR(384) | NULLABLE | 384-dimensional vector embedding |
| `content_type` | VARCHAR(20) | DEFAULT 'question' | Type of content embedded |
| `created_at` | TIMESTAMP | DEFAULT NOW | Creation timestamp |

### 3. `rate_limits`
Request throttling and rate limiting.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `identifier` | VARCHAR(255) | PRIMARY KEY | Unique identifier (typically IP address) |
| `requests` | REAL | DEFAULT 1 | Number of requests in current window |
| `window_start` | TIMESTAMP | DEFAULT NOW | Start of current rate limit window |

### 4. `unanswered_questions`
Analytics for questions without good matches.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT random | Unique identifier |
| `question` | TEXT | NOT NULL | The unanswered question |
| `similarity_score` | REAL | NULLABLE | Best similarity score found |
| `user_ip` | VARCHAR(255) | NULLABLE | User's IP address |
| `created_at` | TIMESTAMP | DEFAULT NOW | Creation timestamp |

## Required Database Functions

### 1. `match_qa` RPC Function
Vector similarity search function for finding related Q&A pairs.

**Parameters:**
- `query_embedding`: The embedding vector to search against
- `similarity_threshold`: Minimum similarity score (typically 0.7)
- `match_count`: Maximum number of results to return

**Returns:** Array of similar Q&A pairs with similarity scores.

### 2. `check_rate_limit` RPC Function
Rate limiting function to prevent abuse.

**Parameters:**
- `p_identifier`: Unique identifier (IP address)
- `p_limit`: Maximum requests allowed (typically 30)
- `p_window_seconds`: Time window in seconds (typically 60)

**Returns:** Object with `allowed` (boolean) and `remaining` (number) fields.

## Indexes

The following indexes are recommended for optimal performance:

1. **Vector Index**: On `qa_embeddings.embedding` for fast similarity search
2. **Foreign Key Index**: On `qa_embeddings.qa_id` for join performance
3. **Rate Limit Index**: On `rate_limits.window_start` for cleanup operations
4. **Analytics Index**: On `unanswered_questions.created_at` for reporting

## Data Flow

1. **Q&A Ingestion**: New Q&A pairs are inserted into `qa_pairs`
2. **Embedding Generation**: Embeddings are created and stored in `qa_embeddings`
3. **User Query**: Questions are embedded and matched using `match_qa` function
4. **Rate Limiting**: Checked via `check_rate_limit` function
5. **Analytics**: Unanswered questions logged to `unanswered_questions`

## Configuration

The system uses the following thresholds:
- **Similarity Threshold**: 0.7 (minimum similarity for matches)
- **Rate Limit**: 30 requests per minute
- **Rate Limit Window**: 60 seconds
- **Max Search Results**: 3-5 similar Q&A pairs

## Local Development Workflow

### Prerequisites
- **Supabase CLI** >= 1.0.0
- **Docker** (for local database stack)
- **Node.js** >= 18.0.0

### Setup Process

1. **Initialize Supabase**
   ```bash
   # From project root
   supabase start

   # This starts:
   # - PostgreSQL database (port 54322)
   # - Supabase Studio (port 54323)
   # - API Gateway (port 54321)
   # - Edge Functions runtime
   ```

2. **Apply Schema**
   ```bash
   # From frontend/ directory
   npm run db:push      # Apply Drizzle schema to local DB
   npm run db:migrate   # Generate migrations if needed
   ```

3. **Verify Setup**
   ```bash
   # Check services status
   supabase status

   # Open database management UI
   # http://127.0.0.1:54323 (Supabase Studio)

   # Or use Drizzle Studio
   npm run db:studio
   ```

### Development Commands

```bash
# Database operations
supabase db reset           # Reset with fresh migrations
supabase db diff            # Generate schema differences
supabase db push           # Apply local changes to remote

# Edge Functions
supabase functions serve    # Start functions locally
supabase functions deploy   # Deploy to production
supabase functions logs     # View function logs

# Data management
npm run ingest             # Import Q&A data
npm run db:studio          # Open Drizzle Studio
```

## Related Files

### Core Database Files
- **Schema Definition**: `/frontend/src/lib/server/qa.ts`
- **Supabase Client**: `/frontend/src/lib/server/supabase.ts`
- **Chat Types**: `/frontend/src/lib/types/chat.ts`
- **API Endpoint**: `/frontend/src/routes/api/qa-chat/+server.ts`

### Supabase Configuration
- **Main Config**: `/supabase/config.toml`
- **Keep-Alive Function**: `/supabase/functions/keep-alive/index.ts`
- **Environment Setup**: `/frontend/.env.local`

### Data Ingestion
- **Ingestion Script**: `/frontend/src/scripts/ingest-qa.ts`
- **Embeddings Generator**: `/frontend/src/lib/server/embeddings.ts`
- **Source Data**: `/frontend/src/modelData/dataSets/`

---

## Implementation History

### 2025-01-19 - Database Setup and Data Ingestion

**Changes Made:**

1. **Schema Implementation**
   - Updated `/frontend/src/lib/server/qa.ts` with proper 384-dimensional vector support
   - Implemented Drizzle ORM schema with all required tables and relationships
   - Added proper TypeScript type exports for all tables

2. **Supabase Integration Updates**
   - Enhanced `/frontend/src/lib/server/supabase.ts` with 384-dimension validation
   - Added robust error handling for vector dimension mismatches
   - Implemented comprehensive database utility functions
   - Added fallback OpenRouter API support in `/frontend/src/lib/server/embeddings-script.ts`

3. **Script Infrastructure**
   - Updated `/frontend/src/lib/server/supabase-script.ts` for Node.js compatibility
   - Modified `/frontend/src/lib/server/embeddings.ts` to use `$env/static/private` for proper SvelteKit environment variable handling
   - Enhanced `/frontend/src/scripts/ingest-qa.ts` with comprehensive batch processing

4. **Data Ingestion Process**
   - Successfully ingested **187 Q&A pairs** from 4 JSON datasets:
     - `about-me.json`
     - `experience.json`
     - `services.json`
     - `skills.json`
   - Generated and stored **187 embeddings** using HuggingFace BAAI/bge-small-en-v1.5 model
   - Achieved **100% success rate** with automatic retry logic for API failures

5. **Testing and Validation**
   - Verified database schema with RPC function testing
   - Confirmed vector similarity search functionality with test queries:
     - "What technologies do you use?" → 87.2% similarity match
     - "How can I contact you?" → 88.6% similarity match
     - "What's your experience?" → 100.0% similarity match
   - Validated 384-dimensional embedding consistency across all records

**Technical Details:**
- **Embedding Model**: BAAI/bge-small-en-v1.5 (384 dimensions)
- **API Provider**: HuggingFace Inference API
- **Rate Limiting**: 500ms between requests, 2s retry delays
- **Batch Processing**: 10 items per batch with comprehensive error handling
- **Database State**: 187 Q&A pairs with corresponding embeddings ready for production use

**Files Modified:**
- `/frontend/src/lib/server/qa.ts` - Schema definition
- `/frontend/src/lib/server/supabase.ts` - Enhanced with validation
- `/frontend/src/lib/server/supabase-script.ts` - Node.js compatibility
- `/frontend/src/lib/server/embeddings.ts` - Updated to use SvelteKit's `$env/static/private` for proper environment variable access
- `/frontend/src/lib/server/embeddings-script.ts` - OpenRouter API integration
- `/frontend/src/scripts/ingest-qa.ts` - Comprehensive ingestion tool
- `/docs/architecture/database/overview.md` - Database documentation

### 2025-09-26 - Supabase Local Development Setup
<!-- Updated: 2025-09-26 16:38:00 UTC -->

**Changes Made:**

1. **Complete Supabase Integration**
   - Added `/supabase/config.toml` with comprehensive local development configuration
   - Configured PostgreSQL 17, Supabase Studio, API Gateway, and Edge Runtime
   - Set up proper port mapping and service integration

2. **Keep-Alive Edge Function**
   - Implemented `/supabase/functions/keep-alive/index.ts` to prevent database hibernation
   - Added proper CORS handling and error management
   - Configured automatic deployment and JWT verification

3. **Local Development Workflow**
   - Established `supabase start/stop` commands for service management
   - Integrated Drizzle ORM with local Supabase instance
   - Added database reset and migration workflows

4. **Documentation Updates**
   - Created comprehensive Supabase integration guide
   - Added keep-alive function documentation
   - Updated main README with local development instructions

**New Services Available:**
- Supabase Studio: http://127.0.0.1:54323
- PostgreSQL: http://127.0.0.1:54322
- API Gateway: http://127.0.0.1:54321
- Edge Functions: http://127.0.0.1:54321/functions/v1

**Files Added:**
- `/supabase/config.toml` - Main Supabase configuration
- `/supabase/functions/keep-alive/index.ts` - Database keep-alive function
- `/supabase/functions/keep-alive/deno.json` - Deno runtime config
- `/docs/integrations/supabase-integration.md` - Integration documentation
- `/docs/integrations/keep-alive-function.md` - Keep-alive function guide

## Production Deployment

### Supabase Project Setup

1. **Create Project**
   ```bash
   # Link to Supabase project
   supabase link --project-ref <your-project-ref>

   # Deploy schema and functions
   supabase db push
   supabase functions deploy
   ```

2. **Environment Variables**
   ```bash
   # Set production secrets
   supabase secrets set OPENAI_API_KEY=<your-key>
   supabase secrets set HUGGINGFACE_API_KEY=<your-key>
   ```

3. **Data Migration**
   ```bash
   # Import production data
   npm run ingest
   ```

### Keep-Alive Function

The project includes a critical keep-alive Edge Function to prevent database hibernation:

- **Location**: `/supabase/functions/keep-alive/`
- **Purpose**: Maintains database activity to prevent free-tier hibernation
- **Scheduling**: Should be called every 10-15 minutes in production
- **Documentation**: See [Keep-Alive Function Guide](/docs/integrations/keep-alive-function.md)

### Environment Configuration

#### Local Development
```env
# .env.local
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=<local_anon_key>
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

#### Production
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=<production_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<production_service_role_key>
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check if Supabase is running
   supabase status

   # Restart services
   supabase stop && supabase start
   ```

2. **Schema Sync Issues**
   ```bash
   # Reset local database
   supabase db reset

   # Reapply schema
   npm run db:push
   ```

3. **Vector Dimension Mismatch**
   ```bash
   # Check embedding dimensions in data
   supabase sql --file - <<< "SELECT array_length(embedding, 1) FROM qa_embeddings LIMIT 5;"

   # Should return 384 for all records
   ```

The chat feature database is now fully operational with local development support and ready for semantic search queries.