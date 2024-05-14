import {
  boolean,
  date,
  decimal,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { genderEnum } from '../const';
import { InferSelectModel, relations, sql } from 'drizzle-orm';
import { CONSTRAINT_NAME } from '@/const';

import { academics } from './academic.schema';
import { achievements } from './achievement.schema';
import { experiences } from './experience.schema';
import { doctorSchedules } from './doctor_schedule.schema';
import { certificates } from './certificate.schema';
import { doctorTreatments } from './doctor_treatments.schema';

export const doctors = pgTable('doctors', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: varchar('username')
    .notNull()
    .unique(CONSTRAINT_NAME.DOCTOR.USERNAME),
  password: varchar('password').notNull(),
  email: varchar('email').notNull().unique(CONSTRAINT_NAME.DOCTOR.EMAIL),
  name: varchar('name').notNull(),
  gender: genderEnum('gender').notNull(),
  phone: varchar('phone').notNull().unique(CONSTRAINT_NAME.DOCTOR.PHONE),
  dob: date('dob').notNull(),
  address: text('address').notNull(),
  nik: varchar('nik').unique(CONSTRAINT_NAME.DOCTOR.NIK),
  profile_picture: varchar('profile_picture'),
  tax: decimal('tax'),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').$onUpdateFn(() => new Date()),
});

export const doctorRelations = relations(doctors, ({ many }) => ({
  academics: many(academics),
  achievements: many(achievements),
  experiences: many(experiences),
  certificates: many(certificates),
  schedules: many(doctorSchedules),
  treatments: many(doctorTreatments),
}));

export type Doctor = InferSelectModel<typeof doctors>;
