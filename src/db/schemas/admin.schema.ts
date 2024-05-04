import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  date,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { enumToPgEnum } from '@/helpers/enumToPgEnum';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

// Declare drizzle enum
export const genderEnum = pgEnum('gender', enumToPgEnum(Gender));

export const admins = pgTable('admins', {
  id: uuid('id').primaryKey(),
  username: varchar('username').unique().notNull(),
  password: varchar('password').notNull(),
  role: varchar('role').notNull(),
  email: varchar('email').notNull(),
  gender: genderEnum('gender').notNull(),
  dob: date('dob').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').$onUpdateFn(() => new Date()),
});
