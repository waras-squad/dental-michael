import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { doctors } from './doctor.schema';
import { InferSelectModel, relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-typebox';

export const achievements = pgTable('achievements', {
  id: serial('id').primaryKey(),
  title: varchar('title').notNull(),
  description: text('description').notNull(),
  year: integer('year').notNull(),
  doctor_id: uuid('doctor_id')
    .notNull()
    .references(() => doctors.id),
  created_at: timestamp('created_at').defaultNow(),
});

export const achievementRelations = relations(achievements, ({ one }) => ({
  doctor: one(doctors, {
    fields: [achievements.doctor_id],
    references: [doctors.id],
  }),
}));

export type Achievement = InferSelectModel<typeof achievements>;
export const fullCreateAchievementDTO = createInsertSchema(achievements);
