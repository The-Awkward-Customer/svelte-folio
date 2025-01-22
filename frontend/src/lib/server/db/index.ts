import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
if (!env.SUPABASE_URL) throw new Error('SUPABASE_URL is not set');
const client = postgres(env.SUPABASE_URL);
export const db = drizzle(client);
