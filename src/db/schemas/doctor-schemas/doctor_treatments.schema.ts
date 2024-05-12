import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { doctors } from './doctor.schema';
import { InferSelectModel, relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-typebox';

export const doctorTreatments = pgTable('doctor_treatments', {
  id: serial('id').primaryKey(),
  doctor_id: uuid('doctor_id')
    .notNull()
    .references(() => doctors.id),
  name: text('name').notNull(),
  price: integer('price'),
  duration: integer('duration').notNull(),
  duration_type: text('duration_type').notNull(),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at')
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const doctorTreatmentRelations = relations(
  doctorTreatments,
  ({ one }) => ({
    doctor: one(doctors, {
      fields: [doctorTreatments.doctor_id],
      references: [doctors.id],
    }),
  })
);

export type DoctorTreatment = InferSelectModel<typeof doctorTreatments>;
export const createFullDoctorTreatmentDTO =
  createInsertSchema(doctorTreatments);
