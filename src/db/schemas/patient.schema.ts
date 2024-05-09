import { date, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { genderEnum } from './const';
import { InferSelectModel, sql } from 'drizzle-orm';
import { CONSTRAINT_NAME } from '@/const';

export const patients = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: varchar('email').notNull().unique(CONSTRAINT_NAME.PATIENT.EMAIL),
  password: varchar('password').notNull(),
  name: varchar('name').notNull(),
  phone: varchar('phone').notNull().unique(CONSTRAINT_NAME.PATIENT.PHONE),
  gender: genderEnum('gender').notNull(),
  dob: date('dob').notNull(),
  nik: varchar('nik').unique(CONSTRAINT_NAME.PATIENT.NIK),
  profile_picture: varchar('profile_picture'),
  created_by: varchar('created_by').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').$onUpdateFn(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

export type Patient = InferSelectModel<typeof patients>;
