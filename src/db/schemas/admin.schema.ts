import { pgTable, uuid, varchar, timestamp, date } from 'drizzle-orm/pg-core';
import { genderEnum } from './const';
import { InferSelectModel, sql } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-typebox';
import { Gender } from '@/enum';
import { t } from 'elysia';

export const admins = pgTable('admins', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: varchar('username').unique().notNull(),
  password: varchar('password').notNull(),
  role: varchar('role').notNull(),
  email: varchar('email').unique().notNull(),
  gender: genderEnum('gender').notNull(),
  dob: date('dob').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').$onUpdateFn(() => new Date()),
});

export type Admin = InferSelectModel<typeof admins>;
// export const fullCreateAdminDTO = createInsertSchema(admins, {
//   gender: t.Enum(Gender, {
//     error: "Gender have to be either 'MALE' OR 'FEMALE'",
//     description: "'MALE' or 'FEMALE'",
//   }),
// });
