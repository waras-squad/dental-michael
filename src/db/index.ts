import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schemas';

const db_url: string = Bun.env.DB_URL!;

if (!db_url) {
  throw new Error('Please set DB_URL environment variable');
}

const queryClient = postgres(db_url);
export const db = drizzle(queryClient, {
  schema,
  logger: !(Bun.env.NODE_ENV === 'production'),
});
