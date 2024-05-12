import {
  integer,
  pgTable,
  serial,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { InferSelectModel, relations } from 'drizzle-orm';
import { doctors } from './doctor.schema';
import { createInsertSchema } from 'drizzle-typebox';
import { t } from 'elysia';

export const certificates = pgTable('certificates', {
  id: serial('id').primaryKey(),
  title: varchar('title').notNull(),
  issuer: varchar('issuer').notNull(),
  year_obtained: integer('year_obtained').notNull(),
  doctor_id: uuid('doctor_id')
    .notNull()
    .references(() => doctors.id),
  created_at: timestamp('created_at').defaultNow(),
});

export const certificatesRelations = relations(certificates, ({ one }) => ({
  doctor: one(doctors, {
    fields: [certificates.doctor_id],
    references: [doctors.id],
  }),
}));

export type Certificate = InferSelectModel<typeof certificates>;
export const fullCreateCertificateDTO = createInsertSchema(certificates);
