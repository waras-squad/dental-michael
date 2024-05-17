import {
  boolean,
  integer,
  pgTable,
  serial,
  time,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { doctors } from './doctor.schema';
import { InferSelectModel, relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-typebox';

export const doctorSchedules = pgTable('doctor_schedules', {
  id: serial('id').primaryKey(),
  doctor_id: uuid('doctor_id')
    .notNull()
    .references(() => doctors.id),
  day_of_week: integer('day_of_week').notNull(),
  start_at: time('start_at').notNull(),
  end_at: time('end_at').notNull(),
  is_close: boolean('is_close').notNull().default(false),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at')
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const doctorSchedulesRelations = relations(
  doctorSchedules,
  ({ one }) => ({
    doctor: one(doctors, {
      fields: [doctorSchedules.doctor_id],
      references: [doctors.id],
    }),
  })
);

export type DoctorSchedule = InferSelectModel<typeof doctorSchedules>;
export const createFullDoctorScheduleDTO = createInsertSchema(doctorSchedules);
