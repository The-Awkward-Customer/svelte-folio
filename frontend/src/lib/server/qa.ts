import { pgTable, uuid, text, varchar, timestamp, vector, real } from 'drizzle-orm/pg-core';

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
  embedding: vector('embedding', { dimensions: 1536 }),
  contentType: varchar('content_type', { length: 20 }).default('question'),
  createdAt: timestamp('created_at').defaultNow()
});