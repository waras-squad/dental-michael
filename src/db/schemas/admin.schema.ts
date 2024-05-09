import { pgTable, uuid, varchar, timestamp, date } from 'drizzle-orm/pg-core';
import { genderEnum } from './const';
import { InferSelectModel, sql } from 'drizzle-orm';

export const admins = pgTable('admins', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: varchar('username').unique().notNull(),
  password: varchar('password').notNull(),
  role: varchar('role').notNull(),
  email: varchar('email').notNull(),
  gender: genderEnum('gender').notNull(),
  dob: date('dob').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').$onUpdateFn(() => new Date()),
});

export type Admin = InferSelectModel<typeof admins>;
