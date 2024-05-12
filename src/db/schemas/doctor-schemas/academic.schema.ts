import {
  integer,
  pgTable,
  serial,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { doctors } from './doctor.schema';
import { InferSelectModel, relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-typebox';

export const academics = pgTable('academics', {
  id: serial('id').primaryKey(),
  degree_title: varchar('degree_title').notNull(),
  institution: varchar('institution').notNull(),
  year: integer('year').notNull(),
  doctor_id: uuid('doctor_id')
    .notNull()
    .references(() => doctors.id),
  created_at: timestamp('created_at').defaultNow(),
});

export const academicRelations = relations(academics, ({ one }) => ({
  doctor: one(doctors, {
    fields: [academics.doctor_id],
    references: [doctors.id],
  }),
}));

export type Academic = InferSelectModel<typeof academics>;
export const fullCreateAcademicDTO = createInsertSchema(academics);
