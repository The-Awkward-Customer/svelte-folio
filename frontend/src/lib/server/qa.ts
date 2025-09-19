import { pgTable, uuid, text, varchar, timestamp, vector, real } from 'drizzle-orm/pg-core';

// Main Q&A pairs table
export const qaPairs = pgTable('qa_pairs', {
  id: uuid('id').primaryKey().defaultRandom(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  category: varchar('category', { length: 100 }),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Embeddings table with 384 dimensions (for sentence-transformers)
export const qaEmbeddings = pgTable('qa_embeddings', {
  id: uuid('id').primaryKey().defaultRandom(),
  qaId: uuid('qa_id').references(() => qaPairs.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  embedding: vector('embedding', { dimensions: 384 }), // Updated to 384
  contentType: varchar('content_type', { length: 20 }).default('question'),
  createdAt: timestamp('created_at').defaultNow()
});

// Rate limiting table
export const rateLimits = pgTable('rate_limits', {
  identifier: varchar('identifier', { length: 255 }).primaryKey(),
  requests: real('requests').default(1),
  windowStart: timestamp('window_start').defaultNow()
});

// Analytics table for unanswered questions
export const unansweredQuestions = pgTable('unanswered_questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  question: text('question').notNull(),
  similarityScore: real('similarity_score'),
  userIp: varchar('user_ip', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow()
});

// Type exports for TypeScript
export type QAPair = typeof qaPairs.$inferSelect;
export type NewQAPair = typeof qaPairs.$inferInsert;
export type QAEmbedding = typeof qaEmbeddings.$inferSelect;
export type NewQAEmbedding = typeof qaEmbeddings.$inferInsert;
export type RateLimit = typeof rateLimits.$inferSelect;
export type UnansweredQuestion = typeof unansweredQuestions.$inferSelect;