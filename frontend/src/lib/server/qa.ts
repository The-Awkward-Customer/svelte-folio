// lib/server/db/schema/qa.ts
import { pgTable, uuid, text, varchar, timestamp, real } from 'drizzle-orm/pg-core';
import { customType } from 'drizzle-orm/pg-core';

// Custom vector type for Drizzle
const vector = customType<{ data: number[]; driverData: string }>({
  dataType() {
    return 'vector(384)';
  },
  toDriver(value: number[]): string {
    return JSON.stringify(value);
  },
  fromDriver(value: string): number[] {
    return JSON.parse(value);
  },
});

export const qaPairs = pgTable('qa_pairs', {
  id: uuid('id').primaryKey().defaultRandom(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  category: varchar('category', { length: 100 }),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const qaEmbeddings = pgTable('qa_embeddings', {
  id: uuid('id').primaryKey().defaultRandom(),
  qaId: uuid('qa_id').references(() => qaPairs.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  embedding: vector('embedding'),
  contentType: varchar('content_type', { length: 20 }).default('question'),
  createdAt: timestamp('created_at').defaultNow()
});

export const rateLimits = pgTable('rate_limits', {
  identifier: varchar('identifier', { length: 255 }).primaryKey(),
  requests: real('requests').default(1),
  windowStart: timestamp('window_start').defaultNow()
});

export const unansweredQuestions = pgTable('unanswered_questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  question: text('question').notNull(),
  similarityScore: real('similarity_score'),
  userIp: varchar('user_ip', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow()
});