import {
  json,
  pgTable,
  serial,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { accountTypeEnum, logActivityEnum } from './schema-const';

export const accountActivityLogs = pgTable('account_activity_logs', {
  id: serial('id').primaryKey(),
  target_id: uuid('target_id').notNull(),
  actor_id: uuid('actor_id').notNull(),
  action: logActivityEnum('action').notNull(),
  executed_at: timestamp('executed_at').defaultNow(),
  target_type: accountTypeEnum('target_type').notNull(),
  actor_type: accountTypeEnum('actor_type').notNull(),
  details: json('details').notNull(),
});
