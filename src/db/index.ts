import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schemas';
import { env } from '@/validators';

const db_url: string = env.DB_URL!;

if (!db_url) {
  throw new Error('Please set DB_URL environment variable');
}

const queryClient = postgres(db_url);
export const db = drizzle(queryClient, {
  schema,
  logger: !(env.NODE_ENV === 'production'),
});
