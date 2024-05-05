import { date, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { genderEnum } from './schema-const';
import { sql } from 'drizzle-orm';

export const patients = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: varchar('email').notNull(),
  password: varchar('password').notNull(),
  name: varchar('name').notNull(),
  phone: varchar('phone').notNull(),
  gender: genderEnum('gender').notNull(),
  dob: date('dob').notNull(),
  nik: varchar('nik'),
  profile_picture: varchar('profile_picture'),
  created_by: varchar('created_by').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').$onUpdateFn(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
