import {
  boolean,
  date,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { InferSelectModel, relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-typebox';
import { doctors } from './doctor.schema';

export const experiences = pgTable('experiences', {
  id: serial('id').primaryKey(),
  title: varchar('title').notNull(),
  company: varchar('company').notNull(),
  description: text('description'),
  start_date: date('start_date'),
  end_date: date('end_date'),
  is_current: boolean('is_current').default(false),
  doctor_id: uuid('doctor_id')
    .notNull()
    .references(() => doctors.id),
  created_at: timestamp('created_at').defaultNow(),
});

export const experienceRelations = relations(experiences, ({ one }) => ({
  doctor: one(doctors, {
    fields: [experiences.doctor_id],
    references: [doctors.id],
  }),
}));

export type Experience = InferSelectModel<typeof experiences>;
export const createFullExperienceDTO = createInsertSchema(experiences);
